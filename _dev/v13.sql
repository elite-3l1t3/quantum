-- =====================================================================
-- biof v13.sql  (дараалал: ... v10 → v11 → v12 → v13)  Supabase → SQL Editor дээр бүхлээр нь Run. Дахин ажиллуулж болно.
-- 1) Нууцлал: IP хаягийг хэзээ ч шууд хадгалахгүй (зөвхөн хэш).
-- 2) Төрсөн огноо бүрэн хасагдсан: хадгалсан огноог устгаж, цаашид хадгалахгүй.
-- 3) Профайлын хамгаалалт: холбоосын дүрс, онцгой хүрээ (verified), онцлох холбоос ≤1, текстийн уртын хязгаар.
-- 4) Сайтын мэдэгдэл (админ бичнэ, нүүр/самбарт харагдана).
-- =====================================================================

-- 1) IP → хэш
create or replace function req_ip() returns text language sql stable as $$
  select md5('biof-ip:' || coalesce(
    nullif(current_setting('request.headers', true), '')::json->>'cf-connecting-ip',
    split_part(coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-forwarded-for', ''), ',', 1),
    'unknown'))
$$;
update flags set ip = md5('biof-ip:' || ip) where ip is not null and ip !~ '^[0-9a-f]{32}$';
delete from rl2 where k ~ '\d+\.\d+\.\d+\.\d+';

-- 2) Төрсөн огноог устгах
update profiles set theme = theme #- '{ab,bd}' where jsonb_typeof(theme) = 'object' and theme->'ab' ? 'bd';

-- 3) Профайлын хамгаалалт (UPDATE бүрд)
create or replace function biof_links_guard() returns trigger
language plpgsql as $$
declare ok boolean := new.role in ('admin','moderator') or exists (select 1 from unnest(coalesce(new.badges, '{}'::text[])) b where lower(b) = 'verified');
begin
  if jsonb_typeof(new.links) = 'array' and new.links is distinct from old.links then
    new.links := coalesce((
      select jsonb_agg(
        case when not ok and coalesce(x->>'icon', '') <> 'web' then x - 'img' else x end
        - case when o = (select min(o2) from jsonb_array_elements(new.links) with ordinality t2(x2, o2) where (x2->>'hl') is not null) then 'zz_none' else 'hl' end
        order by o)
      from jsonb_array_elements(new.links) with ordinality t(x, o)), '[]'::jsonb);
  end if;
  if jsonb_typeof(new.theme) = 'object' then
    if not ok and coalesce(new.theme->>'frame', '') in ('fire','ice','sakura','galaxy') then new.theme := new.theme - 'frame'; end if;
    if new.theme->'ab' ? 'bd' then new.theme := new.theme #- '{ab,bd}'; end if;
    if length(coalesce(new.theme->>'st', '')) > 60 then new.theme := jsonb_set(new.theme, '{st}', to_jsonb(left(new.theme->>'st', 60))); end if;
    if jsonb_typeof(new.theme->'cd') = 'object' and (length(coalesce(new.theme->'cd'->>'t', '')) > 30 or coalesce(new.theme->'cd'->>'at', '') !~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$') then
      new.theme := new.theme - 'cd';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists links_guard on profiles;
create trigger links_guard before update on profiles for each row execute function biof_links_guard();

-- 4) Сайтын мэдэгдэл (site_content.k = 'notice')
create table if not exists site_content(k text primary key, body text);
alter table site_content enable row level security;
drop policy if exists "site_content read v13" on site_content;
create policy "site_content read v13" on site_content for select using (true);
create or replace function admin_set_notice(p_body text) returns text
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then return 'denied'; end if;
  p_body := left(trim(coalesce(p_body, '')), 300);
  update site_content set body = p_body where k = 'notice';
  if not found then insert into site_content(k, body) values ('notice', p_body); end if;
  insert into mod_log(actor, act, note) values (auth.uid(), 'notice', p_body);
  return 'ok';
end $$;
revoke execute on function admin_set_notice(text) from public, anon;
grant execute on function admin_set_notice(text) to authenticated;

-- 5) Шинэ хуудсууд (тэргүүлэгчдийн "Шинэ" таб) — нийтийн мэдээлэл л
create or replace function new_pages(p_limit int default 50)
returns table(bid bigint, username text, display_name text, avatar_url text, views bigint, likes bigint)
language sql stable security definer set search_path = public as $$
  select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text, p.views::bigint, p.likes::bigint
  from profiles p
  where p.username is not null and not p.banned and not p.hidden and p.avatar_url is not null
  order by p.created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
$$;
grant execute on function new_pages(int) to anon, authenticated;


-- 6) Баталгаажаагүй имэйлд профайл үүсгэхгүй (санамсаргүй имэйлээр өдрийн хязгаар дүүргэхээс сэргийлнэ).
--    Имэйлээр бүртгүүлэгчийн профайл кодоо баталгаажуулж анх нэвтрэхэд (ensure_profile) үүснэ.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(new.raw_app_meta_data->>'provider', '') = 'email' and new.email_confirmed_at is null then return new; end if;
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
  if coalesce(u.raw_app_meta_data->>'provider', '') = 'email' and u.email_confirmed_at is null then return 'unconfirmed'; end if;
  if not rl2_ok('ens:' || auth.uid(), 10, 3600) then return 'rate'; end if;
  perform biof_make_profile(auth.uid(), coalesce(u.raw_user_meta_data, '{}'::jsonb));
  return 'ok';
end $$;
revoke execute on function ensure_profile() from public, anon;
grant execute on function ensure_profile() to authenticated;

notify pgrst, 'reload schema';
select 'v13 ok' as status,
  (select count(*) from flags where ip !~ '^[0-9a-f]{32}$') as raw_ip_left,
  (select count(*) from profiles where theme->'ab' ? 'bd') as birthdays_left;
