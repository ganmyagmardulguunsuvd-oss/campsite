-- Монгол аялал — мэдээллийн сангийн бүтэц
-- Supabase → SQL Editor → New query → энэ файлыг бүтнээр нь хуулж Run дарна.

-- 1. Хэрэглэгчийн профайл ------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  premium_until timestamptz,          -- энэ огнооноос өмнө премиум эрхтэй
  created_at    timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Хэрэглэгч зөвхөн өөрийн профайлыг уншина.
-- Шинэчлэх (update) эрх өгөхгүй: premium_until-ийг зөвхөн админ эсвэл төлбөрийн сервер өөрчилнө.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id);

-- Шинэ хэрэглэгч бүртгүүлэхэд профайл автоматаар үүснэ
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Нэвтэрсэн хэрэглэгч премиум эсэхийг шалгах функц
create or replace function public.is_premium()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and premium_until > now());
$$;

-- 2. Хадгалсан аяллууд ---------------------------------------------------
create table if not exists public.trips (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  name       text not null check (char_length(name) between 1 and 120),
  payload    jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists trips_user_idx on public.trips (user_id, created_at desc);
alter table public.trips enable row level security;

drop policy if exists "own trips read"   on public.trips;
drop policy if exists "premium insert"   on public.trips;
drop policy if exists "own trips delete" on public.trips;
create policy "own trips read"   on public.trips for select using (auth.uid() = user_id);
create policy "premium insert"   on public.trips for insert with check (auth.uid() = user_id and public.is_premium());
create policy "own trips delete" on public.trips for delete using (auth.uid() = user_id);

-- 3. Админ: хэрэглэгчид гараар премиум өгөх (QPay холбогдох хүртэл) ---------
-- update public.profiles set premium_until = now() + interval '30 days' where email = 'хэрэглэгчийн@имэйл.mn';
-- Премиум хэрэглэгчдийн жагсаалт:
-- select email, premium_until from public.profiles where premium_until > now() order by premium_until;
