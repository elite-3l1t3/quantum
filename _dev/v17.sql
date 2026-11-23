-- biof v17.sql (2026-11-23) — v16.sql-ийн ДАРАА ажиллуулна. Дахин ажиллуулж болно (аюулгүй).
-- Тэргүүлэгчид хоёр тусдаа табтай болно:
--   "Шинэ"     → new_pages()    : саяхан нээгдсэн (бүртгүүлсэн) хуудсууд, зурагтай
--   "Идэвхтэй" → recent_pages() : саяхан хуудсаа бодитоор янзалсан хүмүүс (edited_at)
-- АЖИЛЛУУЛАХ: Supabase → SQL Editor → бүтнээр нь хуулж → Run.

alter table profiles add column if not exists edited_at timestamptz;

-- "Шинэ": өмнөх (v13) шиг бүртгүүлсэн огноогоор. Буцаах төрөл v16-тай ижил (edited_at багана хэвээр).
drop function if exists new_pages(int);
create function new_pages(p_limit int default 50)
returns table(bid bigint, username text, display_name text, avatar_url text, views bigint, likes bigint, edited_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text, p.views::bigint, p.likes::bigint, p.edited_at
  from profiles p
  where p.username is not null and not p.banned and not coalesce(p.hidden, false) and p.avatar_url is not null
  order by p.created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
$$;
grant execute on function new_pages(int) to anon, authenticated;

-- "Идэвхтэй": сүүлд агуулгаа шинэчилсэн (зураг эсвэл холбоостой) хуудсууд
drop function if exists recent_pages(int);
create function recent_pages(p_limit int default 50)
returns table(bid bigint, username text, display_name text, avatar_url text, views bigint, likes bigint, edited_at timestamptz)
language sql stable security definer set search_path = public as $$
  select p.bid::bigint, p.username::text, p.display_name::text, p.avatar_url::text, p.views::bigint, p.likes::bigint, p.edited_at
  from profiles p
  where p.username is not null and not p.banned and not coalesce(p.hidden, false) and p.edited_at is not null
    and (p.avatar_url is not null or (jsonb_typeof(p.links) = 'array' and jsonb_array_length(p.links) > 0))
  order by p.edited_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
$$;
revoke execute on function recent_pages(int) from public;
grant execute on function recent_pages(int) to anon, authenticated;

select 'v17 ok' as status;
