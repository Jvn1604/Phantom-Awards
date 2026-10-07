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

-- =====================================================================
-- 6) EDITABLE CATEGORIES + NOMINEES + PICTURES + PAUSE SWITCH
-- After running this, open admin.html > Overview and click
-- "Import default list" once. From then on you edit everything in admin.html.
-- =====================================================================
alter table public.config add column if not exists paused boolean not null default false;

create table if not exists public.categories (
  id     text primary key,
  name   text not null,
  sort   int  not null default 0,
  hidden boolean not null default false,
  closed boolean not null default false
);
create table if not exists public.nominees (
  id          uuid primary key default gen_random_uuid(),
  category_id text not null references public.categories(id) on delete cascade,
  name        text not null,
  image_url   text,
  sort        int  not null default 0
);
alter table public.categories enable row level security;
alter table public.nominees   enable row level security;

drop policy if exists "read categories"        on public.categories;
drop policy if exists "admin writes categories" on public.categories;
drop policy if exists "read nominees"          on public.nominees;
drop policy if exists "admin writes nominees"   on public.nominees;
create policy "read categories" on public.categories for select using (not hidden or public.is_admin());
create policy "admin writes categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "read nominees" on public.nominees for select using (
  exists (select 1 from public.categories c where c.id = nominees.category_id and (not c.hidden or public.is_admin())));
create policy "admin writes nominees" on public.nominees for all using (public.is_admin()) with check (public.is_admin());

-- Votes are now checked: not paused, before deadline, category open, and the choice must be a real nominee
drop policy if exists "insert own votes" on public.votes;
drop policy if exists "update own votes" on public.votes;
create policy "insert own votes" on public.votes for insert with check (
  auth.uid() = voter_id
  and now() < (select voting_ends from public.config)
  and not (select paused from public.config)
  and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false  -- Google (non-anonymous) accounts only
  and exists (select 1 from public.categories c where c.id = votes.category_id and not c.closed and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = votes.category_id and n.id::text = votes.choice));
create policy "update own votes" on public.votes for update
  using (auth.uid() = voter_id)
  with check (
  auth.uid() = voter_id
  and now() < (select voting_ends from public.config)
  and not (select paused from public.config)
  and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false  -- Google (non-anonymous) accounts only
  and exists (select 1 from public.categories c where c.id = votes.category_id and not c.closed and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = votes.category_id and n.id::text = votes.choice));

-- Public totals now skip hidden categories (choice = nominee id)
create or replace function public.get_totals()
returns table (category_id text, choice text, votes int)
language sql security definer set search_path = public as $$
  select v.category_id, v.choice, count(*)::int
  from public.votes v join public.categories c on c.id = v.category_id
  where not c.hidden and now() >= (select reveal_at from public.config)
  group by v.category_id, v.choice
$$;

-- Admin: delete spam / test votes
create or replace function public.admin_delete_votes(scope text, target text default null)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if scope = 'all' then delete from public.votes where true;
  elsif scope = 'category' then delete from public.votes where category_id = target;
  elsif scope = 'nominee' then delete from public.votes where choice = target;
  elsif scope = 'voter' then delete from public.votes where voter_id = target::uuid;
  elsif scope = 'invalid' then
    delete from public.votes v where not exists
      (select 1 from public.nominees x where x.category_id = v.category_id and x.id::text = v.choice);
  else raise exception 'bad scope'; end if;
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.admin_delete_votes(text, text) from public, anon;
grant execute on function public.admin_delete_votes(text, text) to authenticated;

-- Picture storage (public images, only you can upload)
insert into storage.buckets (id, name, public) values ('nominee-images', 'nominee-images', true)
on conflict (id) do nothing;
drop policy if exists "admin manages nominee images" on storage.objects;
create policy "admin manages nominee images" on storage.objects for all to authenticated
  using (bucket_id = 'nominee-images' and public.is_admin())
  with check (bucket_id = 'nominee-images' and public.is_admin());

-- IMPORTANT: votes now store the nominee id (not the name). Clear any test votes:
--   delete from votes;

-- 7) WHO VOTED (Google login): admin-only list of voters
create or replace function public.admin_voters()
returns table (voter_id uuid, email text, name text, votes int, last_vote timestamptz, is_anonymous boolean)
language sql security definer set search_path = public, auth as $$
  select v.voter_id, u.email::text,
         coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')::text,
         count(*)::int, max(v.updated_at), coalesce(u.is_anonymous, false)
  from public.votes v join auth.users u on u.id = v.voter_id
  where public.is_admin()
  group by v.voter_id, u.id
$$;
revoke execute on function public.admin_voters() from public, anon;
grant execute on function public.admin_voters() to authenticated;

-- Make Supabase notice the new tables right away (fixes "could not find the table in the schema cache")
notify pgrst, 'reload schema';
