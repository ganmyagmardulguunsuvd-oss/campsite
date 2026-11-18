-- 5-р алхам: Шатахууны үнэ (#1) ба айл буудал (#13)

-- 1. Шатахууны үнэ ------------------------------------------------------------
create table if not exists public.fuel_prices (
  code       text primary key,
  name       text not null,
  price      integer not null check (price between 0 and 100000),
  sort       integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.fuel_prices enable row level security;
drop policy if exists "fuel public read" on public.fuel_prices;
drop policy if exists "fuel admin write" on public.fuel_prices;
create policy "fuel public read" on public.fuel_prices for select using (true);
create policy "fuel admin write" on public.fuel_prices for all using (public.is_admin()) with check (public.is_admin());

-- Ойролцоо анхны үнэ — админ хуудаснаас бодит үнээр шинэчилнэ
insert into public.fuel_prices (code, name, price, sort) values
  ('a80',    'А-80',            3000, 1),
  ('ai92',   'АИ-92',           3300, 2),
  ('ai92e',  'АИ-92 Евро-5',    3700, 3),
  ('ai95',   'АИ-95',           4200, 4),
  ('ai98',   'АИ-98',           4800, 5),
  ('diesel', 'Дизель',          3700, 6),
  ('lpg',    'Шингэн хий (LPG)',1600, 7)
on conflict (code) do nothing;

-- 2. Айл буудал, нутгийн бүтээгдэхүүн -------------------------------------------
create table if not exists public.homestays (
  id           uuid primary key default gen_random_uuid(),
  aimag        text not null check (char_length(aimag) between 2 and 30),
  soum         text check (soum is null or char_length(soum) <= 60),
  name         text not null check (char_length(name) between 2 and 100),
  phone        text check (phone is null or char_length(phone) <= 40),
  fb           text check (fb is null or char_length(fb) <= 300),
  offers       text[] not null default '{}',
  season       text check (season is null or char_length(season) <= 60),
  note         text check (note is null or char_length(note) <= 600),
  consent      boolean not null default false,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_by uuid default auth.uid() references auth.users on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists homestays_aimag_idx on public.homestays (aimag, status);
alter table public.homestays enable row level security;

drop policy if exists "homestay public read" on public.homestays;
drop policy if exists "homestay submit" on public.homestays;
drop policy if exists "homestay admin update" on public.homestays;
drop policy if exists "homestay admin delete" on public.homestays;
create policy "homestay public read" on public.homestays
  for select using (status = 'approved' or public.is_admin() or submitted_by = auth.uid());
create policy "homestay submit" on public.homestays
  for insert to authenticated
  with check (status = 'pending' and consent = true and submitted_by = auth.uid());
create policy "homestay admin update" on public.homestays for update using (public.is_admin()) with check (public.is_admin());
create policy "homestay admin delete" on public.homestays for delete using (public.is_admin());
