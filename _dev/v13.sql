-- =====================================================================
-- biof v13.sql  (дараалал: ... v11 → v12 → v13)  Нууцлал: IP хаягийг хэзээ ч шууд хадгалахгүй.
-- req_ip() одоо IP-ийн хэш (md5) буцаана → хурд хязгаарлагч (rl2) болон мэдэгдэл (flags.ip)-д зөвхөн хэш хадгалагдана.
-- =====================================================================
create or replace function req_ip() returns text language sql stable as $$
  select md5('biof-ip:' || coalesce(
    nullif(current_setting('request.headers', true), '')::json->>'cf-connecting-ip',
    split_part(coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-forwarded-for', ''), ',', 1),
    'unknown'))
$$;
-- Өмнө хадгалсан мэдэгдлийн IP-г хэш болгоно
update flags set ip = md5('biof-ip:' || ip) where ip is not null and ip !~ '^[0-9a-f]{32}$';
-- Хурд хязгаарлагчийн хуучин (IP агуулсан) түр мөрүүдийг устгана
delete from rl2 where k ~ '\d+\.\d+\.\d+\.\d+|:[0-9a-f]*:[0-9a-f:]*$';
select 'v13 ok' as status, (select count(*) from flags where ip !~ '^[0-9a-f]{32}$') as raw_ip_left;
