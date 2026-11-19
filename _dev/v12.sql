-- =====================================================================
-- biof v12.sql  (дараалал: ... v8 → v10 → v11 → v12)  Supabase → SQL Editor дээр бүхлээр нь Run. Дахин ажиллуулж болно.
-- Шинэ: холбоос бүрийн дарсан тоо (өдрөөр нэгтгэсэн, 35 хоногоос хуучныг устгана), дагах (follow) + дагагчийн тоо.
-- Квот: нэг холбоос/өдөрт 1 мөр; IP-ээр минутад 60 дарах, хүнээр цагт 60 дагах хязгаартай.
-- =====================================================================

-- 1) Холбоос дарсан тоо. k = холбоосын URL-ийн богино hash (клиент тооцно)
create table if not exists link_clicks(
  profile_id uuid not null references profiles(id) on delete cascade,
  day date not null default current_date,
  k text not null check (k ~ '^[a-z0-9]{1,16}$'),
  n int not null default 0,
  primary key (profile_id, day, k));
alter table link_clicks enable row level security;
drop policy if exists "clicks own read" on link_clicks;
create policy "clicks own read" on link_clicks for select using (profile_id = (select auth.uid()) or (select is_admin()));
revoke insert, update, delete on link_clicks from anon, authenticated;

create or replace function add_click(p_pid uuid, p_k text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(p_k, '') !~ '^[a-z0-9]{1,16}$' then return; end if;
  if not rl2_ok('clk:' || req_ip(), 60, 60) then return; end if;
  if not exists (select 1 from profiles where id = p_pid and not banned and username is not null) then return; end if;
  insert into link_clicks(profile_id, day, k, n) values (p_pid, current_date, p_k, 1)
    on conflict (profile_id, day, k) do update set n = link_clicks.n + 1;
  if random() < 0.002 then delete from link_clicks where day < current_date - 35; end if;
end $$;
grant execute on function add_click(uuid, text) to anon, authenticated;

-- 2) Дагах
alter table profiles add column if not exists followers int not null default 0;
grant select (followers) on profiles to anon, authenticated;
create table if not exists follows(
  follower uuid not null references profiles(id) on delete cascade,
  followee uuid not null references profiles(id) on delete cascade,
  at timestamptz not null default now(),
  primary key (follower, followee),
  check (follower <> followee));
create index if not exists follows_followee on follows(followee);
alter table follows enable row level security;
drop policy if exists "follows own read" on follows;
create policy "follows own read" on follows for select using (follower = (select auth.uid()));
revoke insert, update, delete on follows from anon, authenticated;

create or replace function toggle_follow(p_pid uuid) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or auth.uid() = p_pid then return null; end if;
  if exists (select 1 from profiles where id = auth.uid() and banned) then return null; end if;
  if exists (select 1 from follows where follower = auth.uid() and followee = p_pid) then
    delete from follows where follower = auth.uid() and followee = p_pid;
    update profiles set followers = greatest(0, followers - 1) where id = p_pid;
    return false;
  end if;
  if not rl2_ok('fol:' || auth.uid(), 60, 3600) then return null; end if;
  if not exists (select 1 from profiles where id = p_pid and not banned and username is not null) then return null; end if;
  insert into follows(follower, followee) values (auth.uid(), p_pid);
  update profiles set followers = followers + 1 where id = p_pid;
  return true;
end $$;
revoke execute on function toggle_follow(uuid) from public, anon;
grant execute on function toggle_follow(uuid) to authenticated;

-- Миний дагадаг хүмүүс (нийтэд харагдах хуудсууд л)
create or replace function my_following() returns table(bid bigint, username text, display_name text, avatar_url text)
language sql stable security definer set search_path = public as $$
  select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text
  from follows f join profiles p on p.id = f.followee
  where f.follower = auth.uid() and p.username is not null and not p.banned and not p.hidden
  order by f.at desc limit 100
$$;
revoke execute on function my_following() from public, anon;
grant execute on function my_following() to authenticated;

insert into reserved(username) values ('app'),('install'),('qr'),('follow'),('sw') on conflict do nothing;
notify pgrst, 'reload schema';
select 'v12 ok' as status;
