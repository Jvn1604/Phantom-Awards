-- PHANTOM AWARDS 2026: run this whole file in Supabase > SQL Editor.
-- BEFORE RUNNING: replace YOUR_ADMIN_EMAIL (near the bottom) with the email of your Supabase admin user.
-- Safe to run more than once.
-- Also enable: Authentication > Providers > "Allow anonymous sign-ins".

-- 1) Votes: one row per person per category
create table if not exists public.votes (
  voter_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id text not null,
  choice      text not null,
  updated_at  timestamptz not null default now(),
  primary key (voter_id, category_id)
);
alter table public.votes enable row level security;

-- 2) Event dates (edit these two values to run your event)
create table if not exists public.config (
  id int primary key default 1 check (id = 1),
  voting_ends timestamptz not null,
  reveal_at   timestamptz not null
);
insert into public.config (id, voting_ends, reveal_at)
values (1, '2026-12-01 23:59:00+08', '2026-12-10 20:00:00+08')
on conflict (id) do nothing;
alter table public.config enable row level security;
drop policy if exists "anyone reads config" on public.config;
create policy "anyone reads config" on public.config for select using (true);

-- 3) Voting rules: only your own rows, and only before the deadline
drop policy if exists "read own votes"   on public.votes;
drop policy if exists "insert own votes" on public.votes;
drop policy if exists "update own votes" on public.votes;
create policy "read own votes" on public.votes for select
  using (auth.uid() = voter_id);
create policy "insert own votes" on public.votes for insert
  with check (auth.uid() = voter_id and now() < (select voting_ends from public.config));
create policy "update own votes" on public.votes for update
  using (auth.uid() = voter_id)
  with check (auth.uid() = voter_id and now() < (select voting_ends from public.config));

-- 4) Totals are secret until reveal_at (enforced here, not just on the website)
drop view if exists public.vote_totals;
create or replace function public.get_totals()
returns table (category_id text, choice text, votes int)
language sql security definer set search_path = public as $$
  select v.category_id, v.choice, count(*)::int
  from public.votes v
  where now() >= (select reveal_at from public.config)
  group by v.category_id, v.choice
$$;
grant execute on function public.get_totals() to anon, authenticated;

-- ---------------------------------------------------------------
-- CHANGE THE DATES any time:
--   update config set voting_ends = '2026-12-01 23:59+08', reveal_at = '2026-12-10 20:00+08';
-- GO LIVE EARLY (reveal during your stream):
--   update config set reveal_at = now();
--
-- YOUR PRIVATE RESULTS (SQL Editor always works for you, even before reveal):
--   select category_id, choice, count(*) as votes from votes
--   group by 1,2 order by 1, 3 desc;
--   select count(distinct voter_id) as voters from votes;
-- ---------------------------------------------------------------

-- =====================================================================
-- 5) ADMIN DASHBOARD (admin.html)
-- A) Dashboard > Authentication > Users > "Add user": create YOUR email + password
--    (tick "Auto Confirm User").
-- B) Put the SAME email below and run the whole file again.
-- =====================================================================
create table if not exists public.admins (email text primary key);
alter table public.admins enable row level security;   -- no policies: nobody can read it from the website
insert into public.admins (email) values ('jeeven1604@gmail.com') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
$$;

create or replace function public.admin_totals()
returns table (category_id text, choice text, votes int)
language sql security definer set search_path = public as $$
  select v.category_id, v.choice, count(*)::int from public.votes v
  where public.is_admin() group by v.category_id, v.choice
$$;

create or replace function public.admin_overview() returns json
language sql security definer set search_path = public as $$
  select case when public.is_admin() then json_build_object(
    'voters', (select count(distinct voter_id) from public.votes),
    'votes',  (select count(*) from public.votes),
    'daily',  (select coalesce(json_agg(json_build_object('day', d, 'n', n) order by d), '[]'::json)
               from (select updated_at::date d, count(*) n from public.votes group by 1) x)
  ) else null end
$$;

-- public "fans have voted" counter (a number only)
create or replace function public.public_voter_count() returns int
language sql security definer set search_path = public as $$
  select count(distinct voter_id)::int from public.votes
$$;

-- admin can change the dates from the dashboard
drop policy if exists "admin updates config" on public.config;
create policy "admin updates config" on public.config for update
  using (public.is_admin()) with check (public.is_admin());

revoke execute on function public.admin_totals(), public.admin_overview() from public, anon;
grant execute on function public.is_admin(), public.public_voter_count() to anon, authenticated;
grant execute on function public.admin_totals(), public.admin_overview() to authenticated;
