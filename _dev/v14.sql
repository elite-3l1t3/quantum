-- =====================================================================
-- biof v14.sql  (дараалал: ... v12 → v13 → v14)  Supabase → SQL Editor дээр бүхлээр нь Run. Дахин ажиллуулж болно.
-- Хууль: Хүний хувийн мэдээлэл хамгаалах тухай хуулийн дагуу хэрэглэгчийн зөвшөөрлийг (хувилбар, огноо) бүртгэнэ.
-- =====================================================================
alter table profile_private add column if not exists consent_ver int;
alter table profile_private add column if not exists consent_at timestamptz;

create or replace function accept_terms(p_ver int) returns text
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not exists (select 1 from profiles where id = auth.uid()) then return 'none'; end if;
  if p_ver is null or p_ver < 1 or p_ver > 1000 then return 'invalid'; end if;
  insert into profile_private(id) values (auth.uid()) on conflict (id) do nothing;
  update profile_private set consent_ver = greatest(coalesce(consent_ver, 0), p_ver), consent_at = now() where id = auth.uid();
  return 'ok';
end $$;
revoke execute on function accept_terms(int) from public, anon;
grant execute on function accept_terms(int) to authenticated;

insert into reserved(username) values ('updates'),('changelog'),('terms'),('legal') on conflict do nothing;
notify pgrst, 'reload schema';
select 'v14 ok' as status;
