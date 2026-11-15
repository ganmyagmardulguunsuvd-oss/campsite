-- 2-р алхам: Дансаар/QR-ээр төлөх хүсэлт + админ эрх
-- Supabase → SQL Editor → New query → бүтнээр нь хуулж Run дарна.
-- (schema.sql-ийг өмнө нь ажиллуулсан байх ёстой)

-- 1. Админууд ---------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade
);
alter table public.admins enable row level security;
-- Policy байхгүй: хэн ч шууд уншиж/бичиж чадахгүй, зөвхөн доорх функцээр шалгана.

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Админ бүх профайлыг харж болно
drop policy if exists "admin read profiles" on public.profiles;
create policy "admin read profiles" on public.profiles for select using (public.is_admin());

-- 2. Төлбөрийн хүсэлтүүд ----------------------------------------------------
create table if not exists public.payment_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  email       text default (auth.jwt() ->> 'email'),
  ref_code    text not null default ('CS-' || upper(substr(replace(auth.uid()::text, '-', ''), 1, 6))),
  amount      integer not null check (amount between 0 and 10000000),
  payer_name  text not null check (char_length(payer_name) between 1 and 100),
  note        text check (note is null or char_length(note) <= 300),
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note  text,
  created_at  timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists payreq_status_idx on public.payment_requests (status, created_at desc);
-- Нэг хэрэглэгч нэг удаад зөвхөн нэг хүлээгдэж буй хүсэлттэй байна
create unique index if not exists payreq_one_pending on public.payment_requests (user_id) where status = 'pending';

alter table public.payment_requests enable row level security;
drop policy if exists "read own or admin" on public.payment_requests;
drop policy if exists "insert own pending" on public.payment_requests;
create policy "read own or admin" on public.payment_requests
  for select using (auth.uid() = user_id or public.is_admin());
create policy "insert own pending" on public.payment_requests
  for insert with check (auth.uid() = user_id and status = 'pending' and reviewed_at is null and admin_note is null);
-- update/delete policy байхгүй: төлөвийг зөвхөн админы функц өөрчилнө.

-- 3. Админы функцууд --------------------------------------------------------
create or replace function public.approve_payment(req_id uuid, p_days integer default 30)
returns void language plpgsql security definer set search_path = public as $$
declare r public.payment_requests;
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  if p_days < 1 or p_days > 3660 then raise exception 'Хоногийн тоо буруу'; end if;
  select * into r from public.payment_requests where id = req_id for update;
  if not found or r.status <> 'pending' then raise exception 'Хүсэлт хүлээгдэж буй төлөвт алга'; end if;
  update public.payment_requests set status = 'approved', reviewed_at = now() where id = req_id;
  update public.profiles
     set premium_until = greatest(coalesce(premium_until, now()), now()) + make_interval(days => p_days)
   where id = r.user_id;
end; $$;

create or replace function public.reject_payment(req_id uuid, reason text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  update public.payment_requests
     set status = 'rejected', reviewed_at = now(), admin_note = left(reason, 300)
   where id = req_id and status = 'pending';
  if not found then raise exception 'Хүсэлт хүлээгдэж буй төлөвт алга'; end if;
end; $$;

create or replace function public.grant_premium_by_email(p_email text, p_days integer default 30)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  if p_days < 1 or p_days > 3660 then raise exception 'Хоногийн тоо буруу'; end if;
  update public.profiles
     set premium_until = greatest(coalesce(premium_until, now()), now()) + make_interval(days => p_days)
   where lower(email) = lower(trim(p_email));
  if not found then raise exception 'Ийм имэйлтэй хэрэглэгч алга (эхлээд сайтад нэвтэрсэн байх ёстой)'; end if;
end; $$;

create or replace function public.admin_stats()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  return json_build_object(
    'users',    (select count(*) from public.profiles),
    'premium',  (select count(*) from public.profiles where premium_until > now()),
    'pending',  (select count(*) from public.payment_requests where status = 'pending'),
    'revenue',  (select coalesce(sum(amount), 0) from public.payment_requests where status = 'approved'),
    'revenue_month', (select coalesce(sum(amount), 0) from public.payment_requests
                       where status = 'approved' and reviewed_at >= date_trunc('month', now()))
  );
end; $$;

revoke execute on function public.approve_payment(uuid, integer)        from public, anon;
revoke execute on function public.reject_payment(uuid, text)            from public, anon;
revoke execute on function public.grant_premium_by_email(text, integer) from public, anon;
revoke execute on function public.admin_stats()                         from public, anon;
grant  execute on function public.approve_payment(uuid, integer)        to authenticated;
grant  execute on function public.reject_payment(uuid, text)            to authenticated;
grant  execute on function public.grant_premium_by_email(text, integer) to authenticated;
grant  execute on function public.admin_stats()                         to authenticated;

-- 4. Өөрийгөө админ болгох (сайтад нэг удаа нэвтэрсний дараа) -----------------
-- insert into public.admins (user_id) select id from auth.users where email = 'таны@имэйл';
