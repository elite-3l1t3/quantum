-- =====================================================================
-- biof v9.sql  (дараалал: ... v7 → v8 → v9)  Supabase → SQL Editor дээр БҮХЭЛД нь ажиллуул. Дахин ажиллуулж болно.
-- Шинэ: модератор эрх (хязгаартай, бүх үйлдэл бүртгэгдэнэ), баталгаажсан тэмдэг хүсэх,
--       хэрэглэгчийн нийтэлсэн хуудасны загварууд (зөвхөн verified) + дуртай/ашигласан тоо,
--       7 хоногийн шилдэг, хайлтаас нуух сонголт.
-- =====================================================================

-- 1) role: user | admin | moderator  (хуучин role CHECK байвал солино)
do $$ declare r record; begin
  for r in select conname from pg_constraint
           where conrelid = 'public.profiles'::regclass and contype = 'c'
             and pg_get_constraintdef(oid) ilike '%role%' and pg_get_constraintdef(oid) ilike '%admin%' loop
    execute format('alter table public.profiles drop constraint %I', r.conname);
  end loop;
end $$;
alter table profiles drop constraint if exists profiles_role_v9;
alter table profiles add constraint profiles_role_v9 check (role in ('user','admin','moderator'));

create or replace function is_mod() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','moderator') and not banned)
$$;
grant execute on function is_mod() to anon, authenticated;

-- Модератор хориглогдсон/нуугдсан хуудас, мэдэгдэл, давж заалдах хүсэлт, хоригийн шалтгааныг харна (нэмэлт policy)
drop policy if exists "profiles mod read" on profiles;
create policy "profiles mod read" on profiles for select using ((select is_mod()));
drop policy if exists "flags mod read" on flags;
create policy "flags mod read" on flags for select using ((select is_mod()));
drop policy if exists "appeals mod read" on appeals;
create policy "appeals mod read" on appeals for select using ((select is_mod()));
drop policy if exists "pp mod read" on profile_private;
create policy "pp mod read" on profile_private for select using ((select is_mod()));

alter table profile_private add column if not exists banned_by uuid;

-- 2) Үйлдлийн бүртгэл (модератор юу хийснийг админ бүгдийг харна)
create table if not exists mod_log(
  id bigserial primary key,
  actor uuid not null,
  act text not null,
  target uuid,
  ref bigint,
  note text,
  at timestamptz not null default now());
create index if not exists mod_log_actor on mod_log(actor, at desc);
alter table mod_log enable row level security;
drop policy if exists "mod_log read" on mod_log;
create policy "mod_log read" on mod_log for select using ((select is_admin()) or actor = (select auth.uid()));
revoke insert, update, delete on mod_log from anon, authenticated;

-- 3) Баталгаажсан тэмдэг хүсэх
create table if not exists verify_req(
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  proof text not null,
  note text,
  status text not null default 'open',
  reply text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid);
alter table verify_req enable row level security;
drop policy if exists "verify read" on verify_req;
create policy "verify read" on verify_req for select using (user_id = (select auth.uid()) or (select is_mod()));
revoke insert, update, delete on verify_req from anon, authenticated;

create or replace function request_verify(p_proof text, p_note text) returns text
language plpgsql security definer set search_path = public as $$
declare p profiles;
begin
  select * into p from profiles where id = auth.uid();
  if not found or p.banned then return 'denied'; end if;
  if exists (select 1 from unnest(coalesce(p.badges, '{}'::text[])) b where lower(b) = 'verified') then return 'already'; end if;
  if p.username is null or p.avatar_url is null or jsonb_array_length(coalesce(p.links, '[]'::jsonb)) = 0 then return 'need'; end if;
  if coalesce(p_proof, '') !~ '^https://\S{4,}$' or length(p_proof) > 300 then return 'proof'; end if;
  if exists (select 1 from verify_req where user_id = auth.uid() and status = 'open') then return 'open'; end if;
  if exists (select 1 from verify_req where user_id = auth.uid() and created_at > now() - interval '14 days') then return 'wait'; end if;
  insert into verify_req(user_id, proof, note) values (auth.uid(), left(p_proof, 300), left(coalesce(p_note, ''), 500));
  return 'ok';
end $$;
revoke execute on function request_verify(text, text) from public, anon;
grant execute on function request_verify(text, text) to authenticated;

-- 4) Модератор/админы нийтлэг үйлдэл (anti-abuse хязгаартай)
--    Модератор: админ/модераторт үйлдэл хийж чадахгүй, өөрийн хорьсон хүний давж заалдахыг шийдэхгүй,
--    админы хорьсон хүнийг суллахгүй, өдөрт 15 хориг / 25 баталгаажуулалт, цагт 60 үйлдэл.
--    Модераторын хориг нь өгөгдлийг УСТГАХГҮЙ (түр хорих) — админ шалгаад бүрмөсөн хорих эсвэл буцаана.
create or replace function mod_act(p_act text, p_pid uuid default null, p_note text default '', p_id bigint default null) returns text
language plpgsql security definer set search_path = public as $$
declare m profiles; t profiles; a appeals; v verify_req; by_role text; n int;
begin
  select * into m from profiles where id = auth.uid();
  if not found or m.banned or m.role not in ('admin','moderator') then return 'denied'; end if;
  if m.role = 'moderator' and not rl2_ok('mod:' || m.id, 60, 3600) then return 'rate'; end if;
  if p_pid is not null then
    select * into t from profiles where id = p_pid;
    if not found then return 'none'; end if;
    if t.id = m.id then return 'self'; end if;
    if t.role in ('admin','moderator') and m.role <> 'admin' then return 'denied'; end if;
  end if;

  if p_act = 'hide' then update profiles set hidden = true where id = p_pid;
  elsif p_act = 'unhide' then update profiles set hidden = false where id = p_pid; update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'flags_done' then update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'suspend' then
    if length(trim(coalesce(p_note, ''))) < 3 then return 'note'; end if;
    if m.role = 'moderator' then
      select count(*) into n from mod_log where actor = m.id and act = 'suspend' and at > now() - interval '1 day';
      if n >= 15 then return 'limit'; end if;
    end if;
    update profiles set banned = true, hidden = false where id = p_pid;
    insert into profile_private(id) values (p_pid) on conflict (id) do nothing;
    update profile_private set ban_reason = left(p_note, 200), banned_by = m.id where id = p_pid;
    update flags set done = true where profile_id = p_pid and not done;
  elsif p_act in ('appeal_ok', 'appeal_no') then
    select * into a from appeals where id = p_id and status = 'open';
    if not found then return 'none'; end if;
    if a.user_id = m.id then return 'self'; end if;
    select pr.role into by_role from profile_private pp join profiles pr on pr.id = pp.banned_by where pp.id = a.user_id;
    if m.role <> 'admin' then
      if (select banned_by from profile_private where id = a.user_id) = m.id then return 'own'; end if;
      if by_role is null or by_role = 'admin' then return 'denied'; end if;
    end if;
    update appeals set status = case when p_act = 'appeal_ok' then 'accepted' else 'rejected' end, decided_at = now() where id = p_id;
    if p_act = 'appeal_ok' then
      update profiles set banned = false, hidden = false where id = a.user_id;
      update profile_private set ban_reason = null, banned_by = null where id = a.user_id;
    end if;
    p_pid := a.user_id;
  elsif p_act in ('verify_ok', 'verify_no') then
    select * into v from verify_req where id = p_id and status = 'open';
    if not found then return 'none'; end if;
    if v.user_id = m.id then return 'self'; end if;
    if m.role = 'moderator' then
      select count(*) into n from mod_log where actor = m.id and act = 'verify_ok' and at > now() - interval '1 day';
      if p_act = 'verify_ok' and n >= 25 then return 'limit'; end if;
    end if;
    update verify_req set status = case when p_act = 'verify_ok' then 'accepted' else 'rejected' end,
      reply = left(coalesce(p_note, ''), 300), decided_at = now(), decided_by = m.id where id = p_id;
    if p_act = 'verify_ok' then
      update profiles set badges = array_append(coalesce(badges, '{}'::text[]), 'verified')
        where id = v.user_id and not exists (select 1 from unnest(coalesce(badges, '{}'::text[])) b where lower(b) = 'verified');
    end if;
    p_pid := v.user_id;
  elsif p_act = 'tpl_hide' then update tpls set hidden = true where id = p_id;
  elsif p_act = 'tpl_show' then update tpls set hidden = false where id = p_id;
  else return 'invalid';
  end if;
  insert into mod_log(actor, act, target, ref, note) values (m.id, p_act, p_pid, p_id, left(coalesce(p_note, ''), 200));
  return 'ok';
end $$;
revoke execute on function mod_act(text, uuid, text, bigint) from public, anon;
grant execute on function mod_act(text, uuid, text, bigint) to authenticated;

-- 5) Админ: модератор томилох/хасах (+ v8-ийн үйлдлүүд)
create or replace function admin_mod(p_act text, p_pid uuid default null, p_id bigint default null) returns text
language plpgsql security definer set search_path = public as $$
declare a appeals;
begin
  if not is_admin() then return 'banned'; end if;
  if p_act = 'set_mod' then update profiles set role = 'moderator' where id = p_pid and role = 'user' and not banned;
  elsif p_act = 'unset_mod' then update profiles set role = 'user' where id = p_pid and role = 'moderator';
  elsif p_act = 'flags_done' then update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'hide' then update profiles set hidden = true where id = p_pid;
  elsif p_act = 'unhide' then update profiles set hidden = false where id = p_pid; update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'flag_hide' then update site set flag_hide = greatest(2, least(coalesce(p_id, 5)::int, 1000)) where id = 1;
  elsif p_act in ('appeal_ok', 'appeal_no') then
    select * into a from appeals where id = p_id and status = 'open';
    if not found then return 'none'; end if;
    update appeals set status = case when p_act = 'appeal_ok' then 'accepted' else 'rejected' end, decided_at = now() where id = p_id;
    if p_act = 'appeal_ok' then
      update profiles set banned = false, hidden = false where id = a.user_id;
      update profile_private set ban_reason = null, banned_by = null where id = a.user_id;
    end if;
  else return 'invalid';
  end if;
  insert into mod_log(actor, act, target, ref) values (auth.uid(), p_act, p_pid, p_id);
  return 'ok';
end $$;
revoke execute on function admin_mod(text, uuid, bigint) from public, anon;
grant execute on function admin_mod(text, uuid, bigint) to authenticated;

-- 6) Хэрэглэгчийн хуудасны загварууд (нийтлэх: зөвхөн verified/админ)
create table if not exists tpls(
  id bigserial primary key,
  owner uuid not null references profiles(id) on delete cascade,
  name text not null check (length(name) between 2 and 30),
  theme jsonb not null check (pg_column_size(theme) < 3000),
  accent text not null default '#ffffff' check (accent ~ '^#[0-9a-fA-F]{6}$'),
  uses int not null default 0,
  favs int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now());
create index if not exists tpls_pop on tpls(uses desc) where not hidden;
alter table tpls enable row level security;
drop policy if exists "tpls read" on tpls;
create policy "tpls read" on tpls for select using (not hidden or owner = (select auth.uid()) or (select is_mod()));
revoke insert, update, delete on tpls from anon, authenticated;

create table if not exists tpl_favs(tpl_id bigint references tpls(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, primary key (tpl_id, user_id));
alter table tpl_favs enable row level security;
drop policy if exists "tpl_favs read" on tpl_favs;
create policy "tpl_favs read" on tpl_favs for select using (user_id = (select auth.uid()));
revoke insert, update, delete on tpl_favs from anon, authenticated;
create table if not exists tpl_uses(tpl_id bigint references tpls(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, primary key (tpl_id, user_id));
alter table tpl_uses enable row level security;
revoke all on tpl_uses from anon, authenticated;

create or replace function tpl_publish(p_name text, p_theme jsonb, p_accent text) returns text
language plpgsql security definer set search_path = public as $$
declare p profiles;
begin
  select * into p from profiles where id = auth.uid();
  if not found or p.banned then return 'denied'; end if;
  if not (p.role = 'admin' or exists (select 1 from unnest(coalesce(p.badges, '{}'::text[])) b where lower(b) = 'verified')) then return 'verified'; end if;
  p_name := trim(coalesce(p_name, ''));
  if length(p_name) < 2 or length(p_name) > 30 then return 'name'; end if;
  if jsonb_typeof(p_theme) <> 'object' or coalesce(p_accent, '') !~ '^#[0-9a-fA-F]{6}$' then return 'invalid'; end if;
  if (select count(*) from tpls where owner = p.id and not hidden) >= 5 then return 'max'; end if;
  if not rl2_ok('tpl:' || p.id, 10, 86400) then return 'rate'; end if;
  insert into tpls(owner, name, theme, accent)
    values (p.id, p_name, p_theme - array['video','music','cursor','loc','enter','disc','noidx','bgp'], lower(p_accent));
  return 'ok';
end $$;
revoke execute on function tpl_publish(text, jsonb, text) from public, anon;
grant execute on function tpl_publish(text, jsonb, text) to authenticated;

create or replace function tpl_delete(p_id bigint) returns text
language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from tpls where id = p_id and owner = auth.uid()) then delete from tpls where id = p_id; return 'ok'; end if;
  return mod_act('tpl_hide', null, '', p_id);
end $$;
revoke execute on function tpl_delete(bigint) from public, anon;
grant execute on function tpl_delete(bigint) to authenticated;

create or replace function tpl_fav(p_id bigint) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not rl2_ok('fav:' || auth.uid(), 60, 3600) then return null; end if;
  if exists (select 1 from tpl_favs where tpl_id = p_id and user_id = auth.uid()) then
    delete from tpl_favs where tpl_id = p_id and user_id = auth.uid();
    update tpls set favs = greatest(0, favs - 1) where id = p_id; return false;
  end if;
  if not exists (select 1 from tpls where id = p_id and not hidden) then return null; end if;
  insert into tpl_favs values (p_id, auth.uid());
  update tpls set favs = favs + 1 where id = p_id; return true;
end $$;
revoke execute on function tpl_fav(bigint) from public, anon;
grant execute on function tpl_fav(bigint) to authenticated;

create or replace function tpl_use(p_id bigint) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into tpl_uses values (p_id, auth.uid()) on conflict do nothing;
  if found then update tpls set uses = uses + 1 where id = p_id and owner <> auth.uid(); end if;
end $$;
revoke execute on function tpl_use(bigint) from public, anon;
grant execute on function tpl_use(bigint) to authenticated;

-- 7) 7 хоногийн шилдэг (үзэлтээр)
create or replace function top_week(p_limit int default 50)
returns table(bid bigint, username text, display_name text, avatar_url text, n bigint)
language sql stable security definer set search_path = public as $$
  select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text, sum(v.n)::bigint
  from views_daily v join profiles p on p.id = v.profile_id
  where v.day >= current_date - 6 and p.username is not null and not p.banned and not p.hidden
  group by p.id
  order by 5 desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
$$;
grant execute on function top_week(int) to anon, authenticated;

-- 8) Нөөцлөх нэрс (сайтын хавтас, SEO файлуудтай давхцахгүй)
insert into reserved(username) values ('js'),('u'),('favicon'),('assets'),('icons'),('sitemap'),('robots'),('manifest'),('seo'),('templates'),('moderator'),('mod')
on conflict do nothing;

-- Дууссан. Шалгах: select * from top_week(5); select is_mod();
