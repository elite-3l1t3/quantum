-- =====================================================================
-- biof v11.sql  (дараалал: ... v8 → v10 → v11)  Supabase → SQL Editor дээр бүхлээр нь Run. Дахин ажиллуулж болно.
-- Шинэ: найз урих (урилгын холбоос + "Найз" тэмдэг), хэрэглэгч хайх, Supabase-ийн хэрэглээ хянах (админ),
--       7 хоног бүрийн имэйл тайлан (GitHub Actions + service_role), verified-д зориулсан профайлын хүрээ.
-- =====================================================================

-- 1) Урилга
alter table profiles add column if not exists invites int not null default 0;
grant select (invites) on profiles to anon, authenticated;
alter table profile_private add column if not exists ref_by uuid;

create or replace function use_ref(p_ref text) returns text
language plpgsql security definer set search_path = public as $$
declare me profiles; r profiles;
begin
  select * into me from profiles where id = auth.uid();
  if not found or me.banned then return 'denied'; end if;
  if me.username is null then return 'later'; end if;
  if me.created_at < now() - interval '3 days' then return 'old'; end if;
  if exists (select 1 from profile_private where id = me.id and ref_by is not null) then return 'used'; end if;
  select * into r from profiles where username = lower(coalesce(p_ref, ''));
  if not found or r.banned or r.id = me.id then return 'invalid'; end if;
  if r.created_at > me.created_at then return 'invalid'; end if;
  if not rl2_ok('ref:' || r.id, 20, 86400) then return 'rate'; end if;
  insert into profile_private(id) values (me.id) on conflict (id) do nothing;
  update profile_private set ref_by = r.id where id = me.id;
  update profiles set invites = invites + 1,
    badges = case when 'friend' = any(coalesce(badges, '{}'::text[])) then badges else array_append(coalesce(badges, '{}'::text[]), 'friend') end
    where id = r.id;
  update profiles set badges = array_append(coalesce(badges, '{}'::text[]), 'friend')
    where id = me.id and not ('friend' = any(coalesce(badges, '{}'::text[])));
  return 'ok';
end $$;
revoke execute on function use_ref(text) from public, anon;
grant execute on function use_ref(text) to authenticated;

-- 2) Хэрэглэгч хайх (хориглогдсон/нуугдсан хүн гарахгүй, IP-ээр хязгаарласан)
create or replace function search_users(q text)
returns table(bid bigint, username text, display_name text, avatar_url text, verified boolean, views bigint)
language plpgsql volatile security definer set search_path = public as $$
declare k text := lower(trim(coalesce(q, '')));
begin
  k := regexp_replace(k, '[%_\\]', '', 'g');
  if length(k) < 2 or length(k) > 30 then return; end if;
  if not rl2_ok('search:' || req_ip(), 60, 60) then return; end if;
  return query
    select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text,
           exists (select 1 from unnest(coalesce(p.badges, '{}'::text[])) b where lower(b) = 'verified'), p.views::bigint
    from profiles p
    where p.username is not null and not p.banned and not p.hidden
      and (p.username like k || '%' or lower(coalesce(p.display_name, '')) like '%' || k || '%')
    order by (p.username = k) desc, (p.username like k || '%') desc, p.views desc
    limit 12;
end $$;
grant execute on function search_users(text) to anon, authenticated;

-- 3) Supabase-ийн үнэгүй эрхийн хэрэглээ (зөвхөн админ)
create or replace function admin_usage() returns jsonb
language plpgsql stable security definer set search_path = public, storage, auth as $$
declare j jsonb;
begin
  if not is_admin() then return null; end if;
  select jsonb_build_object(
    'db_bytes', pg_database_size(current_database()),
    'storage_bytes', (select coalesce(sum((metadata->>'size')::bigint), 0) from storage.objects where bucket_id = 'media'),
    'storage_files', (select count(*) from storage.objects where bucket_id = 'media'),
    'users', (select count(*) from profiles),
    'auth_users', (select count(*) from auth.users),
    'mau', (select count(*) from auth.users where last_sign_in_at > now() - interval '30 days'),
    'today', (select count(*) from profiles where created_at > now() - interval '1 day'),
    'week', (select count(*) from profiles where created_at > now() - interval '7 days'),
    'tpls', (select count(*) from tpls),
    'flags_open', (select count(*) from flags where not done)
  ) into j;
  return j;
end $$;
revoke execute on function admin_usage() from public, anon;
grant execute on function admin_usage() to authenticated;

-- 4) 7 хоног бүрийн имэйл тайлан: зөвхөн service_role (GitHub Actions secret) дуудна.
--    Хэрэглэгч Тохиргоо → "7 хоног бүрийн тайлан"-г асаасан (theme.digest = true) байх ёстой.
create or replace function digest_rows(p_limit int default 40)
returns table(email text, username text, display_name text, wk bigint, prev bigint, likes bigint, views bigint)
language sql stable security definer set search_path = public, auth as $$
  select u.email::text, p.username::text, coalesce(p.display_name, p.username)::text,
    coalesce((select sum(n) from views_daily v where v.profile_id = p.id and v.day >= current_date - 6), 0)::bigint,
    coalesce((select sum(n) from views_daily v where v.profile_id = p.id and v.day between current_date - 13 and current_date - 7), 0)::bigint,
    p.likes::bigint, p.views::bigint
  from profiles p join auth.users u on u.id = p.id
  where p.username is not null and not p.banned and u.email is not null
    and coalesce((p.theme->>'digest')::boolean, false)
  order by p.views desc
  limit least(greatest(coalesce(p_limit, 40), 1), 95)
$$;
revoke execute on function digest_rows(int) from public, anon, authenticated;
do $$ begin if exists (select 1 from pg_roles where rolname = 'service_role') then execute 'grant execute on function digest_rows(int) to service_role'; end if; end $$;

-- 5) Профайлын хамгаалалт: холбоосын өөрийн дүрс + онцгой хүрээ (fire/ice/sakura/galaxy) зөвхөн verified/админд
create or replace function biof_links_guard() returns trigger
language plpgsql as $$
declare ok boolean := new.role in ('admin','moderator') or exists (select 1 from unnest(coalesce(new.badges, '{}'::text[])) b where lower(b) = 'verified');
begin
  if not ok and new.links is distinct from old.links and jsonb_typeof(new.links) = 'array' then
    new.links := coalesce((
      select jsonb_agg(case when coalesce(x->>'icon', '') <> 'web' then x - 'img' else x end order by o)
      from jsonb_array_elements(new.links) with ordinality t(x, o)), '[]'::jsonb);
  end if;
  if not ok and jsonb_typeof(new.theme) = 'object' and coalesce(new.theme->>'frame', '') in ('fire','ice','sakura','galaxy') then
    new.theme := new.theme - 'frame';
  end if;
  return new;
end $$;
drop trigger if exists links_guard on profiles;
create trigger links_guard before update on profiles for each row execute function biof_links_guard();

insert into reserved(username) values ('search'),('invite'),('ref'),('export'),('vendor') on conflict do nothing;

notify pgrst, 'reload schema';
select 'v11 ok' as status, (select count(*) from profiles where invites > 0) as inviters;
