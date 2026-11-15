-- 3-р алхам: Санал хүсэлт
-- Supabase → SQL Editor → бүтнээр нь ажиллуулна (02_payments.sql-ийн дараа).

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid default auth.uid() references auth.users on delete set null,
  kind       text not null default 'idea' check (kind in ('idea', 'bug', 'place', 'other')),
  message    text not null check (char_length(message) between 3 and 2000),
  name       text check (name is null or char_length(name) <= 100),
  contact    text check (contact is null or char_length(contact) <= 150),
  page       text check (page is null or char_length(page) <= 300),
  status     text not null default 'new' check (status in ('new', 'done')),
  created_at timestamptz not null default now()
);
create index if not exists feedback_status_idx on public.feedback (status, created_at desc);
alter table public.feedback enable row level security;

-- Хэн ч (нэвтрээгүй хүн ч) санал илгээж болно, гэхдээ зөвхөн 'new' төлөвтэй
drop policy if exists "anyone can send" on public.feedback;
create policy "anyone can send" on public.feedback
  for insert to anon, authenticated
  with check (status = 'new' and (user_id is null or user_id = auth.uid()));

-- Зөвхөн админ уншиж, төлөв өөрчилнө
drop policy if exists "admin read feedback" on public.feedback;
drop policy if exists "admin update feedback" on public.feedback;
create policy "admin read feedback" on public.feedback for select using (public.is_admin());
create policy "admin update feedback" on public.feedback for update using (public.is_admin()) with check (public.is_admin());
