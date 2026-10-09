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

-- =====================================================================
-- 8) COLLAB CHANNELS, ANNOUNCEMENT BANNER, MORE ADMIN STATS
-- =====================================================================
alter table public.config add column if not exists announcement text;

create table if not exists public.collabs (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  url      text not null,
  icon_url text,
  sort     int  not null default 0
);
alter table public.collabs enable row level security;
drop policy if exists "read collabs"         on public.collabs;
drop policy if exists "admin writes collabs" on public.collabs;
create policy "read collabs" on public.collabs for select using (true);
create policy "admin writes collabs" on public.collabs for all using (public.is_admin()) with check (public.is_admin());

-- Admin overview now also returns votes per hour (48h) and how many categories each voter finished
create or replace function public.admin_overview() returns json
language sql security definer set search_path = public as $$
  select case when public.is_admin() then json_build_object(
    'voters', (select count(distinct voter_id) from public.votes),
    'votes',  (select count(*) from public.votes),
    'daily',  (select coalesce(json_agg(json_build_object('day', d, 'n', n) order by d), '[]'::json)
               from (select updated_at::date d, count(*) n from public.votes group by 1) x),
    'hourly', (select coalesce(json_agg(json_build_object('h', h, 'n', n) order by h), '[]'::json)
               from (select date_trunc('hour', updated_at) h, count(*) n from public.votes
                     where updated_at > now() - interval '48 hours' group by 1) y),
    'completion', (select coalesce(json_agg(json_build_object('cats', c, 'voters', v) order by c), '[]'::json)
               from (select c, count(*) v from (select count(*) c from public.votes group by voter_id) z group by c) w)
  ) else null end
$$;

-- Removed category: "Most Disappointing Game"
delete from public.votes      where category_id = 'most-disappointing-game';
delete from public.categories where id = 'most-disappointing-game';

-- =====================================================================
-- 9) TRAILER LINKS + DISCORD MILESTONE ALERTS
-- =====================================================================
alter table public.nominees add column if not exists link_url text;

create extension if not exists pg_net with schema extensions;

-- Secret settings live here. No policies = the website can never read this table (it holds your webhook).
create table if not exists public.admin_secrets (
  id             int primary key default 1 check (id = 1),
  discord_webhook text,
  enabled        boolean not null default true,
  milestones     int[] not null default '{10,25,50,100,250,500,1000}',
  last_milestone int not null default 0
);
insert into public.admin_secrets (id) values (1) on conflict (id) do nothing;
alter table public.admin_secrets enable row level security;

create or replace function public.admin_get_alerts() returns json
language sql security definer set search_path = public as $$
  select case when public.is_admin() then (
    select json_build_object('has_webhook', coalesce(discord_webhook, '') <> '', 'enabled', enabled,
                             'milestones', milestones, 'last_milestone', last_milestone)
    from public.admin_secrets where id = 1) else null end
$$;

create or replace function public.admin_set_alerts(p_webhook text, p_enabled boolean, p_milestones int[], p_reset boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if p_webhook is not null and p_webhook <> '' and p_webhook !~ '^https://(discord|discordapp)\.com/api/webhooks/' then
    raise exception 'That does not look like a Discord webhook URL';
  end if;
  update public.admin_secrets set
    discord_webhook = case when p_webhook is null then discord_webhook when p_webhook = '' then null else p_webhook end,
    enabled         = coalesce(p_enabled, enabled),
    milestones      = coalesce(p_milestones, milestones),
    last_milestone  = case when p_reset then 0 else last_milestone end
  where id = 1;
end $$;

create or replace function public.admin_test_discord() returns void
language plpgsql security definer set search_path = public, extensions, net as $$
declare w text;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  select discord_webhook into w from public.admin_secrets where id = 1;
  if w is null or w = '' then raise exception 'Save a Discord webhook first'; end if;
  perform net.http_post(url := w, headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object('content', '✅ Phantom Awards alerts are connected.'));
end $$;

-- Fires when a NEW voter casts their first vote; announces each milestone once.
create or replace function public.notify_milestone() returns trigger
language plpgsql security definer set search_path = public, extensions, net as $$
declare s record; voters int; m int;
begin
  if (select count(*) from public.votes where voter_id = new.voter_id) <> 1 then return new; end if;
  select * into s from public.admin_secrets where id = 1;
  if s.discord_webhook is null or s.discord_webhook = '' or not s.enabled then return new; end if;
  select count(distinct voter_id) into voters from public.votes;
  foreach m in array s.milestones loop
    if voters >= m and m > s.last_milestone then
      perform net.http_post(url := s.discord_webhook, headers := '{"Content-Type":"application/json"}'::jsonb,
        body := jsonb_build_object('content', '🎉 **Phantom Awards 2026**: ' || m || ' voters have joined! (' || voters || ' so far)'));
      update public.admin_secrets set last_milestone = m where id = 1;
      s.last_milestone := m;
    end if;
  end loop;
  return new;
exception when others then
  return new;   -- an alert problem must never block a vote
end $$;

drop trigger if exists votes_milestone on public.votes;
create trigger votes_milestone after insert on public.votes
  for each row execute function public.notify_milestone();

revoke execute on function public.admin_get_alerts(), public.admin_set_alerts(text, boolean, int[], boolean), public.admin_test_discord() from public, anon;
grant execute on function public.admin_get_alerts(), public.admin_set_alerts(text, boolean, int[], boolean), public.admin_test_discord() to authenticated;

-- Make Supabase notice the new tables right away (fixes "could not find the table in the schema cache")
notify pgrst, 'reload schema';
