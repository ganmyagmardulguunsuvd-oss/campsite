-- 4-р алхам: 1 өдрийн үнэгүй туршилт (хэрэглэгч бүрт нэг удаа)
alter table public.profiles add column if not exists trial_used_at timestamptz;

create or replace function public.start_trial()
returns timestamptz language plpgsql security definer set search_path = public as $$
declare p public.profiles; new_until timestamptz;
begin
  if auth.uid() is null then raise exception 'Эхлээд нэвтэрнэ үү'; end if;
  select * into p from public.profiles where id = auth.uid() for update;
  if not found then raise exception 'Профайл олдсонгүй'; end if;
  if p.trial_used_at is not null then raise exception 'Туршилтын эрхээ аль хэдийн ашигласан байна'; end if;
  update public.profiles
     set trial_used_at = now(),
         premium_until = greatest(coalesce(premium_until, now()), now()) + interval '1 day'
   where id = auth.uid()
   returning premium_until into new_until;
  return new_until;
end; $$;

revoke execute on function public.start_trial() from public, anon;
grant  execute on function public.start_trial() to authenticated;
