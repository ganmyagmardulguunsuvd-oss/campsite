-- 8-р алхам: аймаг, газрын зураг — хэрэглэгчийн зураг (#3)
-- Supabase → SQL Editor → New query → бүтнээр нь хуулж Run дарна.

create table if not exists public.photos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  author     text,
  aimag      text not null check (char_length(aimag) between 2 and 30),
  place      text check (place is null or char_length(place) <= 120),
  url        text not null check (url ~ '^https://' and char_length(url) <= 400),
  caption    text check (caption is null or char_length(caption) <= 300),
  own        boolean not null default false,
  status     text not null default 'pending' check (status in ('pending','approved','rejected')),
  likes      integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists photos_aimag_idx on public.photos (aimag, status, created_at desc);
create index if not exists photos_pop_idx on public.photos (status, likes desc);
alter table public.photos enable row level security;
drop trigger if exists photos_author on public.photos;
create trigger photos_author before insert or update on public.photos for each row execute procedure public.stamp_author('required');

drop policy if exists "photo read" on public.photos;
drop policy if exists "photo insert" on public.photos;
drop policy if exists "photo admin update" on public.photos;
drop policy if exists "photo delete" on public.photos;
create policy "photo read" on public.photos for select using (status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy "photo insert" on public.photos for insert to authenticated
  with check (status = 'pending' and own = true and likes = 0
    and url like ('%/storage/v1/object/public/media/' || auth.uid()::text || '/%')
    and (select count(*) from public.photos p where p.user_id = auth.uid() and p.created_at > now() - interval '1 day') < 20);
create policy "photo admin update" on public.photos for update using (public.is_admin()) with check (public.is_admin());
create policy "photo delete" on public.photos for delete using (user_id = auth.uid() or public.is_admin());

create table if not exists public.photo_likes (
  photo_id   uuid not null references public.photos on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (photo_id, user_id)
);
alter table public.photo_likes enable row level security;
drop policy if exists "plike read own" on public.photo_likes;
drop policy if exists "plike insert" on public.photo_likes;
drop policy if exists "plike delete" on public.photo_likes;
create policy "plike read own" on public.photo_likes for select using (user_id = auth.uid());
create policy "plike insert" on public.photo_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.photos p where p.id = photo_id and p.status = 'approved'));
create policy "plike delete" on public.photo_likes for delete using (user_id = auth.uid());

create or replace function public.photo_counts()
returns trigger language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.photo_id, old.photo_id);
begin
  update public.photos set likes = (select count(*) from public.photo_likes where photo_id = pid) where id = pid;
  return null;
end; $$;
drop trigger if exists plikes_count on public.photo_likes;
create trigger plikes_count after insert or delete on public.photo_likes for each row execute procedure public.photo_counts();

-- Мэдээлэх төрөлд зураг нэмэх
alter table public.reports drop constraint if exists reports_target_type_check;
alter table public.reports add constraint reports_target_type_check check (target_type in ('story','comment','camp','review','road','photo'));

-- Админ түүхийн татгалзсан шалтгааныг бичих эрх (06-д дутсан)
grant update (admin_note) on public.stories to authenticated;

-- Админы тоололд шинэ зургийг нэмэх
create or replace function public.admin_counts()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  return json_build_object(
    'stories', (select count(*) from public.stories where status = 'pending'),
    'camps',   (select count(*) from public.camps where status = 'pending'),
    'photos',  (select count(*) from public.photos where status = 'pending'),
    'reports', (select count(*) from public.reports where status = 'new'),
    'roads',   (select count(*) from public.road_reports where not hidden and last_confirmed_at > now() - interval '10 days'),
    'ai_today',(select coalesce(sum(n), 0) from public.ai_usage where day = (now() at time zone 'Asia/Ulaanbaatar')::date));
end; $$;
