-- =====================================================================
-- biof v8.sql  (дараалал: schema → update → storage → waitlist → v2 → v3 → v4 → v5 → v6 → v7 → v8)
-- Supabase → SQL Editor дээр БҮХЭЛД нь нэг удаа ажиллуул. Дахин ажиллуулж болно (idempotent).
-- Шинэ: имэйл бүртгэл (Discord-гүй хэрэглэгч), Discord акаунтын насны шаардлага хасагдсан,
--       мэдэгдлийн сонголт + олон мэдэгдлээр автоматаар түр нуух, давж заалдах (appeal),
--       хаагдсан/нуугдсан хуудасны төлөв, холбоосын өөрийн дүрс (lk_*.webp), шахсан аудио/видео (webm).
-- =====================================================================

-- 1) Сайт бүрэн нээлттэй, Discord насны шаардлагагүй
alter table site add column if not exists flag_hide int not null default 5;
update site set open = true where id = 1;
update site set reg_open = true where id = 1;
update site set min_age_days = 0 where id = 1;
update profiles set approved = true where approved is distinct from true;

-- 2) Профайлд "hidden" (олон мэдэгдлийн улмаас түр нуусан) багана
alter table profiles add column if not exists hidden boolean not null default false;
grant select (hidden) on profiles to anon, authenticated;

-- 3) Хурд хязгаарлагч (өөрийн, бусдаас хамааралгүй)
create table if not exists rl2(k text primary key, n int not null, reset timestamptz not null);
alter table rl2 enable row level security;
revoke all on rl2 from anon, authenticated;
create or replace function rl2_ok(p_k text, p_lim int, p_secs int) returns boolean
language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into rl2(k, n, reset) values (p_k, 1, now() + make_interval(secs => p_secs))
  on conflict (k) do update
    set n = case when rl2.reset < now() then 1 else rl2.n + 1 end,
        reset = case when rl2.reset < now() then excluded.reset else rl2.reset end
  returning n into c;
  if random() < 0.01 then delete from rl2 where reset < now() - interval '1 hour'; end if;
  return c <= p_lim;
end $$;
revoke execute on function rl2_ok(text,int,int) from public, anon, authenticated;

create or replace function req_ip() returns text language sql stable as $$
  select coalesce(
    nullif(current_setting('request.headers', true), '')::json->>'cf-connecting-ip',
    split_part(coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-forwarded-for', ''), ',', 1),
    'unknown')
$$;

-- 4) Профайл үүсгэх (Discord болон имэйл хэрэглэгч хоёуланд). Насны шаардлага БАЙХГҮЙ.
create or replace function biof_make_profile(p_uid uuid, p_meta jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare s record; n int; is_first boolean;
begin
  perform pg_advisory_xact_lock(hashtext('biof_bid'));
  if exists (select 1 from profiles where id = p_uid) then return; end if;
  is_first := not exists (select 1 from profiles);
  select * into s from site where id = 1;
  if not is_first then
    if coalesce(s.reg_open, true) = false then raise exception 'registration_closed'; end if;
    if (select count(*) from profiles where created_at > now() - interval '1 day') >= coalesce(s.daily_cap, 300) then
      raise exception 'daily_limit';
    end if;
  end if;
  select coalesce(max(bid), 0) + 1 into n from profiles;
  insert into profiles(id, bid, role, approved) values (p_uid, n, case when is_first then 'admin' else 'user' end, true);
  insert into profile_private(id, discord_id, discord_name)
    select r.id, r.discord_id, r.discord_name
    from jsonb_populate_record(null::profile_private, jsonb_build_object(
      'id', p_uid,
      'discord_id', case when p_meta ? 'provider_id' and (p_meta->>'iss') ilike '%discord%' then p_meta->>'provider_id' end,
      'discord_name', coalesce(p_meta->>'full_name', p_meta->>'name', p_meta->>'user_name'))) r
  on conflict (id) do nothing;
end $$;
revoke execute on function biof_make_profile(uuid, jsonb) from public, anon, authenticated;

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform biof_make_profile(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));
  return new;
end $$;

drop function if exists ensure_profile();
create function ensure_profile() returns text
language plpgsql security definer set search_path = public as $$
declare m jsonb;
begin
  if auth.uid() is null then return 'none'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then return 'ok'; end if;
  if not rl2_ok('ens:' || auth.uid(), 10, 3600) then return 'rate'; end if;
  select coalesce(raw_user_meta_data, '{}'::jsonb) into m from auth.users where id = auth.uid();
  perform biof_make_profile(auth.uid(), coalesce(m, '{}'::jsonb));
  return 'ok';
end $$;
revoke execute on function ensure_profile() from public, anon;
grant execute on function ensure_profile() to authenticated;

-- 5) Нэр авах (Discord насны шалгалтгүй)
drop function if exists claim_username(text);
create function claim_username(u text) returns text
language plpgsql security definer set search_path = public as $$
declare p profiles; s record;
begin
  if auth.uid() is null then return 'invalid'; end if;
  select * into p from profiles where id = auth.uid();
  if not found then return 'none'; end if;
  if p.banned then return 'banned'; end if;
  u := lower(trim(coalesce(u, '')));
  if u !~ '^[a-z0-9_]{3,20}$' then return 'invalid'; end if;
  if p.username = u then return 'ok'; end if;
  select * into s from site where id = 1;
  if p.username is null and coalesce(s.reg_open, true) = false and p.role <> 'admin' then return 'closed'; end if;
  if exists (select 1 from reserved where username = u) then return 'taken'; end if;
  if exists (select 1 from profiles where username = u) then return 'taken'; end if;
  if p.role <> 'admin' and p.username is not null and p.username_changed_at is not null
     and p.username_changed_at > now() - interval '7 days' then return 'cooldown'; end if;
  if p.role <> 'admin' and not rl2_ok('claim:' || auth.uid(), 12, 3600) then return 'rate'; end if;
  update profiles set username = u, username_changed_at = now() where id = auth.uid();
  return 'ok';
exception when unique_violation then return 'taken';
end $$;
revoke execute on function claim_username(text) from public, anon;
grant execute on function claim_username(text) to authenticated;

insert into reserved(username) values ('status'),('tutorial'),('appeal'),('signup'),('verify'),('email'),('maintenance'),('report'),('dashboard'),('panel')
on conflict do nothing;

-- 6) Профайл унших RLS: хориглосон эсвэл нуугдсан хуудас нийтэд харагдахгүй (эзэн, админ харна)
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'public' and tablename = 'profiles' and cmd = 'SELECT' loop
    execute format('drop policy if exists %I on public.profiles', r.policyname);
  end loop;
end $$;
create policy "profiles read v8" on profiles for select using (
  (username is not null and not banned and not hidden)
  or id = (select auth.uid())
  or (select is_admin())
);

-- 7) Хуудасны төлөв: 'banned' | 'hidden' | null
create or replace function page_info(u text) returns text
language sql stable security definer set search_path = public as $$
  select case when banned then 'banned' when hidden then 'hidden' end
  from profiles where username = lower(u) limit 1
$$;
grant execute on function page_info(text) to anon, authenticated;

-- 8) Холбоосын өөрийн дүрс: зөвхөн "web" холбоос, эсвэл verified/админ хэрэглэгч бусад платформд
create or replace function biof_links_guard() returns trigger
language plpgsql as $$
begin
  if new.links is distinct from old.links and jsonb_typeof(new.links) = 'array'
     and not (new.role = 'admin' or exists (select 1 from unnest(coalesce(new.badges, '{}'::text[])) b where lower(b) = 'verified')) then
    new.links := coalesce((
      select jsonb_agg(case when coalesce(x->>'icon', '') <> 'web' then x - 'img' else x end order by o)
      from jsonb_array_elements(new.links) with ordinality t(x, o)), '[]'::jsonb);
  end if;
  return new;
end $$;
drop trigger if exists links_guard on profiles;
create trigger links_guard before update on profiles for each row execute function biof_links_guard();

-- 9) Мэдэгдэл (сонголттой) + олон хүн мэдэгдвэл автоматаар ТҮР НУУХ (устгахгүй, хорихгүй)
create table if not exists flags(
  id bigserial primary key,
  profile_id uuid not null references profiles(id) on delete cascade,
  reporter uuid references auth.users(id) on delete set null,
  ip text,
  cat text not null,
  note text,
  created_at timestamptz not null default now(),
  done boolean not null default false);
create index if not exists flags_open on flags(profile_id) where not done;
alter table flags enable row level security;
drop policy if exists "flags admin read" on flags;
create policy "flags admin read" on flags for select using ((select is_admin()));
revoke insert, update, delete on flags from anon, authenticated;

create or replace function flag_profile(p_pid uuid, p_cat text, p_note text) returns text
language plpgsql security definer set search_path = public as $$
declare ip text := req_ip(); t profiles; s record; n int;
begin
  if p_cat not in ('fake','harass','adult','spam','illegal','hate','other') then return 'invalid'; end if;
  select * into t from profiles where id = p_pid;
  if not found or t.banned then return 'none'; end if;
  if auth.uid() = p_pid then return 'self'; end if;
  if not rl2_ok('flag:ip:' || ip, 6, 3600) then return 'rate'; end if;
  if auth.uid() is not null and not rl2_ok('flag:u:' || auth.uid(), 15, 86400) then return 'rate'; end if;
  if exists (select 1 from flags where profile_id = p_pid and created_at > now() - interval '1 day'
             and ((auth.uid() is not null and reporter = auth.uid()) or (auth.uid() is null and ip = req_ip()))) then
    return 'dup';
  end if;
  insert into flags(profile_id, reporter, ip, cat, note) values (p_pid, auth.uid(), ip, p_cat, left(coalesce(p_note, ''), 300));
  -- Автоматаар нуух: сүүлийн 3 хоногт НЭВТЭРСЭН, өөр өөр хүмүүсийн шийдээгүй мэдэгдэл босгоос хэтэрвэл
  select * into s from site where id = 1;
  select count(distinct reporter) into n from flags
    where profile_id = p_pid and not done and reporter is not null and created_at > now() - interval '3 days';
  if n >= greatest(coalesce(s.flag_hide, 5), 2) and t.role <> 'admin'
     and not exists (select 1 from unnest(coalesce(t.badges, '{}'::text[])) b where lower(b) in ('verified','staff')) then
    update profiles set hidden = true where id = p_pid;
  end if;
  return 'ok';
end $$;
grant execute on function flag_profile(uuid, text, text) to anon, authenticated;

-- 10) Давж заалдах (appeal)
create table if not exists appeals(
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  decided_at timestamptz);
alter table appeals enable row level security;
drop policy if exists "appeals read" on appeals;
create policy "appeals read" on appeals for select using (user_id = (select auth.uid()) or (select is_admin()));
revoke insert, update, delete on appeals from anon, authenticated;

create or replace function submit_appeal(p_body text) returns text
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return 'none'; end if;
  if not exists (select 1 from profiles where id = auth.uid() and banned) then return 'notbanned'; end if;
  p_body := trim(coalesce(p_body, ''));
  if length(p_body) < 10 then return 'short'; end if;
  if exists (select 1 from appeals where user_id = auth.uid() and status = 'open') then return 'open'; end if;
  if exists (select 1 from appeals where user_id = auth.uid() and created_at > now() - interval '1 day') then return 'wait'; end if;
  if (select count(*) from appeals where user_id = auth.uid()) >= 5 then return 'max'; end if;
  insert into appeals(user_id, body) values (auth.uid(), left(p_body, 1000));
  return 'ok';
end $$;
revoke execute on function submit_appeal(text) from public, anon;
grant execute on function submit_appeal(text) to authenticated;

-- 11) Админы нэмэлт үйлдлүүд
create or replace function admin_mod(p_act text, p_pid uuid default null, p_id bigint default null) returns text
language plpgsql security definer set search_path = public as $$
declare a appeals;
begin
  if not is_admin() then return 'banned'; end if;
  if p_act = 'flags_done' then update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'hide' then update profiles set hidden = true where id = p_pid;
  elsif p_act = 'unhide' then update profiles set hidden = false where id = p_pid; update flags set done = true where profile_id = p_pid and not done;
  elsif p_act = 'flag_hide' then update site set flag_hide = greatest(2, least(coalesce(p_id, 5)::int, 1000)) where id = 1;
  elsif p_act in ('appeal_ok', 'appeal_no') then
    select * into a from appeals where id = p_id and status = 'open';
    if not found then return 'none'; end if;
    update appeals set status = case when p_act = 'appeal_ok' then 'accepted' else 'rejected' end, decided_at = now() where id = p_id;
    if p_act = 'appeal_ok' then
      update profiles set banned = false, hidden = false where id = a.user_id;
      update profile_private set ban_reason = null where id = a.user_id;
    end if;
  else return 'invalid';
  end if;
  return 'ok';
end $$;
revoke execute on function admin_mod(text, uuid, bigint) from public, anon;
grant execute on function admin_mod(text, uuid, bigint) to authenticated;

-- 12) Storage: шахсан webm аудио/видео, холбоосын дүрс (lk_xxxxxxxx.webp). Хэрэглэгч бүр ≤20 файл, ≤12MB.
update storage.buckets set file_size_limit = 5242880,
  allowed_mime_types = array['image/webp','image/png','image/jpeg','image/gif',
    'video/mp4','video/webm','audio/mpeg','audio/mp3','audio/ogg','audio/webm','audio/mp4','audio/x-m4a','audio/aac','audio/wav','audio/x-wav']
  where id = 'media';

create or replace function media_ok(p text) returns boolean
language plpgsql stable security definer set search_path = public, storage as $$
declare s record; cnt int; mine bigint; tot bigint; f text;
begin
  if auth.uid() is null then return false; end if;
  if (storage.foldername(p))[1] is distinct from auth.uid()::text then return false; end if;
  if array_length(storage.foldername(p), 1) <> 1 then return false; end if;
  f := storage.filename(p);
  if f !~ '^(avatar|bg|video|music|cursor)\.[a-z0-9]{2,4}$' and f !~ '^lk_[a-z0-9]{8}\.(webp|png|jpg|gif)$' then return false; end if;
  select * into s from site where id = 1;
  if coalesce(s.uploads_open, true) = false then return false; end if;
  if exists (select 1 from profiles where id = auth.uid() and banned) then return false; end if;
  select count(*), coalesce(sum((o.metadata->>'size')::bigint), 0) into cnt, mine
    from storage.objects o where o.bucket_id = 'media' and (storage.foldername(o.name))[1] = auth.uid()::text and o.name <> p;
  if cnt >= 20 or mine > 12 * 1048576 then return false; end if;
  select coalesce(sum((o.metadata->>'size')::bigint), 0) into tot from storage.objects o where o.bucket_id = 'media';
  if tot > 900::bigint * 1048576 then return false; end if;
  return true;
end $$;
grant execute on function media_ok(text) to authenticated;

do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'
           and (coalesce(qual, '') || coalesce(with_check, '')) ilike '%media%' loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;
create policy "media v8 read" on storage.objects for select using (bucket_id = 'media');
create policy "media v8 insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.media_ok(name));
create policy "media v8 update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'media' and public.media_ok(name));
create policy "media v8 delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Дууссан. Шалгах: select page_info('a'); select * from site;
