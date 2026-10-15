-- PHANTOM AWARDS 2026: run this whole file in Supabase > SQL Editor.
-- BEFORE RUNNING: replace YOUR_ADMIN_EMAIL (near the bottom) with the email of your Supabase admin user.
-- Safe to run more than once.
-- Also: Authentication > Providers > Google ON, "Allow anonymous sign-ins" OFF, and Authentication > Multi-Factor > TOTP ON.

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

-- =====================================================================
-- 10) PREDICTIONS GAME, NOMINEE DESCRIPTIONS, HOME SECTIONS
-- =====================================================================
alter table public.nominees   add column if not exists description text;
alter table public.categories add column if not exists grp text;   -- main | genres | gameplay | fun (empty = automatic)

create table if not exists public.predictions (
  voter_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  nominee_id  text not null,
  updated_at  timestamptz not null default now(),
  primary key (voter_id, category_id)
);
alter table public.predictions enable row level security;
drop policy if exists "read own predictions"   on public.predictions;
drop policy if exists "insert own predictions" on public.predictions;
drop policy if exists "update own predictions" on public.predictions;
drop policy if exists "delete own predictions" on public.predictions;
create policy "read own predictions" on public.predictions for select using (auth.uid() = voter_id);
create policy "insert own predictions" on public.predictions for insert with check (
  auth.uid() = voter_id
  and now() < (select voting_ends from public.config)
  and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  and exists (select 1 from public.categories c where c.id = predictions.category_id and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = predictions.category_id and n.id::text = predictions.nominee_id));
create policy "update own predictions" on public.predictions for update
  using (auth.uid() = voter_id)
  with check (
  auth.uid() = voter_id
  and now() < (select voting_ends from public.config)
  and exists (select 1 from public.nominees n where n.category_id = predictions.category_id and n.id::text = predictions.nominee_id));
create policy "delete own predictions" on public.predictions for delete
  using (auth.uid() = voter_id and now() < (select voting_ends from public.config));

-- Leaderboard: unlocks at reveal time. 10 points per correct prediction (a prediction is correct if it matches
-- the community winner; ties count for every tied leader). Names are shown as first name + initial.
create or replace function public.get_leaderboard()
returns table (pos int, name text, points int, correct int, total int, is_me boolean)
language sql security definer set search_path = public, auth as $$
  with tot as (select v.category_id, v.choice, count(*) c from public.votes v group by 1, 2),
  mx  as (select category_id, max(c) m from tot group by 1),
  win as (select t.category_id, t.choice from tot t join mx on mx.category_id = t.category_id and t.c = mx.m),
  pr  as (
    select p.voter_id, count(*)::int n, count(w.choice)::int ok
    from public.predictions p
    join public.categories c on c.id = p.category_id and not c.hidden
    left join win w on w.category_id = p.category_id and w.choice = p.nominee_id
    group by p.voter_id),
  named as (
    select pr.voter_id, pr.n, pr.ok,
      coalesce(nullif(trim(split_part(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''), ' ', 1)), '')
        || case when split_part(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''), ' ', 2) <> ''
                then ' ' || left(split_part(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', ''), ' ', 2), 1) || '.'
                else '' end, 'Player') as nm
    from pr join auth.users u on u.id = pr.voter_id),
  ranked as (select named.*, (rank() over (order by ok desc, n asc))::int rk from named)
  select r.rk, r.nm, r.ok * 10, r.ok, r.n, (r.voter_id = auth.uid())
  from ranked r
  where now() >= (select reveal_at from public.config) and (r.rk <= 20 or r.voter_id = auth.uid())
  order by r.rk, r.nm
$$;
revoke execute on function public.get_leaderboard() from public, anon;
grant execute on function public.get_leaderboard() to authenticated;

-- Moderation delete now also clears predictions
create or replace function public.admin_delete_votes(scope text, target text default null)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if scope = 'all' then delete from public.votes where true; delete from public.predictions where true;
  elsif scope = 'category' then delete from public.votes where category_id = target; delete from public.predictions where category_id = target;
  elsif scope = 'nominee' then delete from public.votes where choice = target; delete from public.predictions where nominee_id = target;
  elsif scope = 'voter' then delete from public.votes where voter_id = target::uuid; delete from public.predictions where voter_id = target::uuid;
  elsif scope = 'invalid' then
    delete from public.votes v where not exists
      (select 1 from public.nominees x where x.category_id = v.category_id and x.id::text = v.choice);
  else raise exception 'bad scope'; end if;
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.admin_delete_votes(text, text) from public, anon;
grant execute on function public.admin_delete_votes(text, text) to authenticated;

-- =====================================================================
-- 11) PDPA: EXPLICIT CONSENT, DATA-SUBJECT RIGHTS, RETENTION, GOOGLE-ONLY VOTING
-- =====================================================================
alter table public.config add column if not exists consent_version text not null default '2026-10';  -- change it to force everyone to re-accept
alter table public.config add column if not exists retention_days  int  not null default 90;       -- voter data is deleted this many days after reveal_at

-- Record of who accepted the Terms + Privacy Policy, and when
create table if not exists public.consents (
  voter_id    uuid primary key references auth.users(id) on delete cascade,
  version     text not null,
  accepted_at timestamptz not null default now()
);
alter table public.consents enable row level security;
drop policy if exists "read own consent" on public.consents;
create policy "read own consent" on public.consents for select using (auth.uid() = voter_id);   -- nobody can write directly

create or replace function public.record_consent() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'sign in first';
  end if;
  insert into public.consents (voter_id, version)
  values (auth.uid(), (select consent_version from public.config where id = 1))
  on conflict (voter_id) do update set version = excluded.version, accepted_at = now();
end $$;
revoke execute on function public.record_consent() from public, anon;
grant execute on function public.record_consent() to authenticated;

-- Only a signed-in GOOGLE account that has accepted the CURRENT policy may vote or predict.
create or replace function public.can_participate() returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
     and (coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
          or jsonb_exists(coalesce(auth.jwt() -> 'app_metadata' -> 'providers', '[]'::jsonb), 'google'))   -- also accepts accounts that were linked to Google later
     and exists (select 1 from public.consents c
                 where c.voter_id = auth.uid()
                   and c.version = (select consent_version from public.config where id = 1))
$$;
grant execute on function public.can_participate() to authenticated;

-- Tells the website exactly why a vote was refused (used to show a clear message)
create or replace function public.participation_status() returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'signed_in', auth.uid() is not null,
    'anonymous', coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false),
    'google',   coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
                or jsonb_exists(coalesce(auth.jwt() -> 'app_metadata' -> 'providers', '[]'::jsonb), 'google'),
    'consent',  exists (select 1 from public.consents c where c.voter_id = auth.uid()
                        and c.version = (select consent_version from public.config where id = 1)),
    'paused',   (select paused from public.config where id = 1),
    'ends',     (select voting_ends from public.config where id = 1))
$$;
grant execute on function public.participation_status() to authenticated;

alter table public.config add column if not exists predictions_enabled boolean not null default true;  -- admin switch for the predictions game

-- Final voting / prediction rules (insert-only for the public; reading is limited to your own rows)
drop policy if exists "insert own votes" on public.votes;
drop policy if exists "update own votes" on public.votes;
create policy "insert own votes" on public.votes for insert with check (
  auth.uid() = voter_id
  and public.can_participate()
  and now() < (select voting_ends from public.config)
  and not (select paused from public.config)
  and exists (select 1 from public.categories c where c.id = votes.category_id and not c.closed and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = votes.category_id and n.id::text = votes.choice));
create policy "update own votes" on public.votes for update
  using (auth.uid() = voter_id)
  with check (
  auth.uid() = voter_id
  and public.can_participate()
  and now() < (select voting_ends from public.config)
  and not (select paused from public.config)
  and exists (select 1 from public.categories c where c.id = votes.category_id and not c.closed and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = votes.category_id and n.id::text = votes.choice));

drop policy if exists "insert own predictions" on public.predictions;
drop policy if exists "update own predictions" on public.predictions;
create policy "insert own predictions" on public.predictions for insert with check (
  auth.uid() = voter_id
  and public.can_participate()
  and now() < (select voting_ends from public.config)
  and exists (select 1 from public.categories c where c.id = predictions.category_id and not c.hidden)
  and exists (select 1 from public.nominees n where n.category_id = predictions.category_id and n.id::text = predictions.nominee_id));
create policy "update own predictions" on public.predictions for update
  using (auth.uid() = voter_id)
  with check (
  auth.uid() = voter_id
  and public.can_participate()
  and now() < (select voting_ends from public.config)
  and exists (select 1 from public.nominees n where n.category_id = predictions.category_id and n.id::text = predictions.nominee_id));

-- Totals that survive the retention purge (anonymous counts only)
create table if not exists public.results_archive (
  category_id text not null,
  choice      text not null,
  votes       int  not null,
  primary key (category_id, choice)
);
alter table public.results_archive enable row level security;   -- no policies: never readable from the website

create or replace function public.get_totals()
returns table (category_id text, choice text, votes int)
language sql security definer set search_path = public as $$
  select x.category_id, x.choice, sum(x.n)::int
  from (select v.category_id, v.choice, count(*) n from public.votes v group by 1, 2
        union all
        select a.category_id, a.choice, a.votes from public.results_archive a) x
  join public.categories c on c.id = x.category_id
  where not c.hidden and now() >= (select reveal_at from public.config where id = 1)
  group by x.category_id, x.choice
$$;

create or replace function public.admin_totals()
returns table (category_id text, choice text, votes int)
language sql security definer set search_path = public as $$
  select x.category_id, x.choice, sum(x.n)::int
  from (select v.category_id, v.choice, count(*) n from public.votes v group by 1, 2
        union all
        select a.category_id, a.choice, a.votes from public.results_archive a) x
  where public.is_admin()
  group by x.category_id, x.choice
$$;

-- RIGHT OF ACCESS / PORTABILITY: a signed-in user downloads everything held about them
create or replace function public.export_my_data() returns json
language sql security definer set search_path = public, auth as $$
  select json_build_object(
    'email', u.email,
    'name', coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    'account_created', u.created_at,
    'consent', (select json_build_object('version', c.version, 'accepted_at', c.accepted_at)
                from public.consents c where c.voter_id = u.id),
    'votes', coalesce((select json_agg(json_build_object('category', cat.name, 'nominee', n.name, 'last_updated', v.updated_at) order by v.updated_at)
                from public.votes v
                left join public.categories cat on cat.id = v.category_id
                left join public.nominees n on n.id::text = v.choice
                where v.voter_id = u.id), '[]'::json),
    'predictions', coalesce((select json_agg(json_build_object('category', cat.name, 'nominee', n.name, 'last_updated', p.updated_at) order by p.updated_at)
                from public.predictions p
                left join public.categories cat on cat.id = p.category_id
                left join public.nominees n on n.id::text = p.nominee_id
                where p.voter_id = u.id), '[]'::json))
  from auth.users u where u.id = auth.uid()
$$;
revoke execute on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;

-- RIGHT OF ERASURE / WITHDRAWAL: a user deletes their own account, votes, predictions and consent record
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if public.is_admin() then raise exception 'Admin accounts cannot be erased here'; end if;
  delete from auth.users where id = auth.uid();      -- cascades to votes, predictions, consents
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Admin: erase one person's account when they email you a deletion request
create or replace function public.admin_erase_voter(target uuid) returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if exists (select 1 from auth.users u join public.admins a on lower(a.email) = lower(u.email) where u.id = target) then
    raise exception 'cannot erase an admin account';
  end if;
  delete from auth.users where id = target;
end $$;
revoke execute on function public.admin_erase_voter(uuid) from public, anon;
grant execute on function public.admin_erase_voter(uuid) to authenticated;

-- RETENTION: keep anonymous totals, delete every voter account + votes + predictions + consents (admins are kept)
create or replace function public._purge_voters() returns int
language plpgsql security definer set search_path = public, auth as $$
declare n int;
begin
  insert into public.results_archive (category_id, choice, votes)
    select category_id, choice, count(*)::int from public.votes group by 1, 2
  on conflict (category_id, choice) do update set votes = public.results_archive.votes + excluded.votes;
  delete from auth.users u
   where u.id in (select voter_id from public.votes union select voter_id from public.predictions union select voter_id from public.consents)
     and lower(coalesce(u.email, '')) not in (select lower(email) from public.admins);
  get diagnostics n = row_count;
  delete from public.votes where true;
  delete from public.predictions where true;
  delete from public.consents where true;
  return n;
end $$;
revoke execute on function public._purge_voters() from public, anon, authenticated;

create or replace function public.admin_purge_voter_data() returns int
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  return public._purge_voters();
end $$;
revoke execute on function public.admin_purge_voter_data() from public, anon;
grant execute on function public.admin_purge_voter_data() to authenticated;

create or replace function public.purge_expired_voter_data() returns void
language plpgsql security definer set search_path = public as $$
declare c record;
begin
  select reveal_at, retention_days into c from public.config where id = 1;
  if now() > c.reveal_at + make_interval(days => c.retention_days)
     and (exists (select 1 from public.votes) or exists (select 1 from public.consents)) then
    perform public._purge_voters();
  end if;
end $$;
revoke execute on function public.purge_expired_voter_data() from public, anon, authenticated;

-- Daily automatic purge (needs the pg_cron extension; if it is unavailable you can still use the admin Purge button)
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule('phantom-purge-voter-data', '15 3 * * *', 'select public.purge_expired_voter_data()');
exception when others then
  raise notice 'pg_cron is not enabled, automatic purge not scheduled: %', sqlerrm;
end $$;

-- =====================================================================
-- 12) SECURITY HARDENING (October 2026)
--  * Admin check uses your confirmed account id, not the email text inside the sign-in token.
--  * Admin dashboard requires 2-step verification (authenticator app, session level aal2).
--    admin.html walks you through the one-time set-up the first time you sign in.
--  * Picture uploads: images only, 2 MB max.
--  * Internal functions can no longer be called from the website.
-- =====================================================================

-- Is the signed-in user an admin account? (no 2-step check; used to block deleting the admin account
-- and to decide whether admin.html should ask for the 2-step code)
create or replace function public.is_admin_account() returns boolean
language sql security definer stable set search_path = public, auth as $$
  select exists (
    select 1 from auth.users u join public.admins a on lower(a.email) = lower(u.email)
    where u.id = auth.uid() and u.email_confirmed_at is not null)
$$;

-- Full admin rights: admin account AND a 2-step verified session.
-- Every admin policy and admin_* function calls this, so all of them now need 2-step verification.
create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public, auth as $$
  select public.is_admin_account() and coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
$$;
revoke execute on function public.is_admin_account() from public, anon;
grant execute on function public.is_admin(), public.is_admin_account() to authenticated;
grant execute on function public.is_admin() to anon;   -- used inside public read policies; returns false for visitors

-- The admin account must never be deletable from the public site (it uses a normal, non-2-step session there).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if public.is_admin_account() then raise exception 'Admin accounts cannot be erased here'; end if;
  delete from auth.users where id = auth.uid();      -- cascades to votes, predictions, consents
end $$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- "Invalid votes" moderation also clears predictions that point at nominees that no longer exist
create or replace function public.admin_delete_votes(scope text, target text default null)
returns int language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_admin() then raise exception 'not allowed'; end if;
  if scope = 'all' then delete from public.votes where true; delete from public.predictions where true;
  elsif scope = 'category' then delete from public.votes where category_id = target; delete from public.predictions where category_id = target;
  elsif scope = 'nominee' then delete from public.votes where choice = target; delete from public.predictions where nominee_id = target;
  elsif scope = 'voter' then delete from public.votes where voter_id = target::uuid; delete from public.predictions where voter_id = target::uuid;
  elsif scope = 'invalid' then
    delete from public.votes v where not exists
      (select 1 from public.nominees x where x.category_id = v.category_id and x.id::text = v.choice);
    get diagnostics n = row_count;
    delete from public.predictions p where not exists
      (select 1 from public.nominees x where x.category_id = p.category_id and x.id::text = p.nominee_id);
    return n;
  else raise exception 'bad scope'; end if;
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.admin_delete_votes(text, text) from public, anon;
grant execute on function public.admin_delete_votes(text, text) to authenticated;

-- Admin functions: signed-in users only (each one also checks is_admin() inside)
revoke execute on function public.admin_totals(), public.admin_overview(), public.admin_voters(),
  public.admin_get_alerts(), public.admin_set_alerts(text, boolean, int[], boolean), public.admin_test_discord(),
  public.admin_erase_voter(uuid), public.admin_purge_voter_data() from public, anon;

-- Internal functions: never callable from the website
revoke execute on function public.notify_milestone(), public._purge_voters(), public.purge_expired_voter_data()
  from public, anon, authenticated;

-- Only signed-in users need these
revoke execute on function public.can_participate(), public.participation_status(), public.get_leaderboard(),
  public.record_consent(), public.export_my_data() from public, anon;

-- Picture uploads: images only, at most 2 MB each (the admin page already shrinks pictures to about 100 KB)
update storage.buckets
   set file_size_limit = 2097152,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'nominee-images';

-- Make Supabase notice the new tables right away (fixes "could not find the table in the schema cache")
notify pgrst, 'reload schema';
