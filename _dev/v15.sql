-- biof v15.sql (2026-11-23)
-- 1) Админ самбараас имэйлээр нэвтрэх/бүртгүүлэхийг хаах/нээх (бот олноор бүртгүүлэхээс хамгаална)
-- 2) Профайлын хамгаалалт: хэрэглэгч зөвхөн өөрийн нэр, bio, зураг, өнгө, холбоос, загвараа өөрчилнө
--    (эрх, тэмдэг, үзэлт, like, хориг гэх мэтийг шууд өөрчлөх боломжгүй), хэмжээний хязгаар, хадгалах хурдны хязгаар
-- 3) Хүснэгтүүдэд клиентээс шууд бичих эрхийг хаана (бүх бичилт зөвхөн шалгалттай функцээр явна)
--
-- АЖИЛЛУУЛАХ: Supabase → SQL Editor → энэ файлыг бүтнээр нь хуулж → Run.
-- Дахин ажиллуулж болно (аюулгүй). v14.sql-ийн дараа ажиллуулна.

-- ───────────────────────── 1) Имэйл нэвтрэлт асаах/унтраах ─────────────────────────
alter table site add column if not exists email_open boolean not null default true;

-- Нэвтрэх цонх аль аргыг харуулахыг мэднэ (нууц мэдээлэлгүй)
create or replace function auth_opts() returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'email', coalesce((select email_open from site where id = 1), true),
    'reg',   coalesce((select reg_open   from site where id = 1), true))
$$;
revoke execute on function auth_opts() from public;
grant execute on function auth_opts() to anon, authenticated;

create or replace function admin_set_email(p_on boolean) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then return 'denied'; end if;
  update site set email_open = coalesce(p_on, true) where id = 1;
  insert into mod_log(actor, act, note) values (auth.uid(), case when coalesce(p_on, true) then 'email_open' else 'email_close' end, '');
  return 'ok';
end $$;
revoke execute on function admin_set_email(boolean) from public, anon;
grant execute on function admin_set_email(boolean) to authenticated;

-- Шинэ хэрэглэгч: имэйл хаалттай бол ШИНЭ имэйл бүртгэлийг серверт хаана.
-- (Алдаа гарахад Supabase хэрэглэгч үүсгэхгүй, код илгээхгүй → имэйлийн квот хэмнэнэ.)
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.raw_app_meta_data->>'provider', '') = 'email' then
    if not coalesce((select email_open from site where id = 1), true) then raise exception 'email_closed'; end if;
    if new.email_confirmed_at is null then return new; end if;
  end if;
  perform biof_make_profile(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));
  return new;
end $$;

drop function if exists ensure_profile();
create function ensure_profile() returns text
language plpgsql security definer set search_path = public as $$
declare u record;
begin
  if auth.uid() is null then return 'none'; end if;
  if exists (select 1 from profiles where id = auth.uid()) then return 'ok'; end if;
  select raw_user_meta_data, raw_app_meta_data, email_confirmed_at into u from auth.users where id = auth.uid();
  if not found then return 'none'; end if;
  if coalesce(u.raw_app_meta_data->>'provider', '') = 'email' then
    if u.email_confirmed_at is null then return 'unconfirmed'; end if;
    if not coalesce((select email_open from site where id = 1), true) then return 'email_closed'; end if;
  end if;
  if not rl2_ok('ens:' || auth.uid(), 10, 3600) then return 'rate'; end if;
  perform biof_make_profile(auth.uid(), coalesce(u.raw_user_meta_data, '{}'::jsonb));
  return 'ok';
end $$;
revoke execute on function ensure_profile() from public, anon;
grant execute on function ensure_profile() to authenticated;

-- ───────────────────────── 2) Профайлын хамгаалалт ─────────────────────────
-- Хадгалах хурдны хязгаар: 10 минутад 40 удаа (нэг хүн)
create or replace function biof_upd_ok() returns boolean
language sql volatile security definer set search_path = public as $$
  select rl2_ok('pupd:' || coalesce(auth.uid()::text, 'x'), 40, 600)
$$;
revoke execute on function biof_upd_ok() from public, anon;
grant execute on function biof_upd_ok() to authenticated;

-- SECURITY INVOKER (зориуд): current_user нь хүсэлт илгээгч ('authenticated'/'anon').
-- Шалгалттай security definer функцууд (like, нэр солих, админ г.м.) эзэмшигчийн эрхээр ажилладаг тул энд саад болохгүй.
create or replace function biof_profile_guard() returns trigger
language plpgsql set search_path = public as $$
declare ok_cols text[] := array['display_name','bio','avatar_url','bg_url','accent','links','theme','updated_at'];
begin
  if current_user not in ('anon', 'authenticated') then return new; end if;
  if tg_op = 'INSERT' then raise exception 'denied: profiles are created by the server'; end if;
  if (to_jsonb(new) - ok_cols) is distinct from (to_jsonb(old) - ok_cols) then
    raise exception 'denied: protected columns';
  end if;
  if coalesce(old.banned, false) then raise exception 'banned'; end if;
  if octet_length(coalesce(new.theme::text, '')) > 16000 then raise exception 'c_len: theme too large'; end if;
  if octet_length(coalesce(new.links::text, '')) > 16000 then raise exception 'c_len: links too large'; end if;
  if jsonb_typeof(new.links) = 'array' and jsonb_array_length(new.links) > 12 then raise exception 'c_len: max 12 links'; end if;
  if new.accent is not null and new.accent !~ '^#[0-9a-fA-F]{6}$' then raise exception 'c_len: accent'; end if;
  if not biof_upd_ok() then raise exception 'rate'; end if;
  return new;
end $$;
-- "zz_" нэр: links_guard-ийн ДАРАА ажиллана (триггерүүд нэрийн дарааллаар)
drop trigger if exists zz_profile_guard on profiles;
create trigger zz_profile_guard before insert or update on profiles for each row execute function biof_profile_guard();

-- ───────────────────────── 3) Шууд бичих эрхийг хаах ─────────────────────────
-- Клиент зөвхөн profiles-ийн дээрх багануудыг шинэчилнэ; бусад бүх бичилт RPC-ээр.
do $$
declare t text;
begin
  foreach t in array array['profile_private','likes','follows','flags','appeals','views_daily','link_clicks','tpls','tpl_favs',
                           'verify_req','mod_log','site','site_content','reserved','rl2'] loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated', t);
    end if;
  end loop;
end $$;
revoke insert, delete, truncate on public.profiles from anon, authenticated;

-- Шалгах (сонголттой): select email_open from site;  select tgname from pg_trigger where tgrelid = 'profiles'::regclass;
