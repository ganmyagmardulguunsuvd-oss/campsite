-- 6-р алхам: хэрэглэгчийн нэр, замын мэдээ (#11), аяллын түүх (#8), кемп (#6),
-- AI туслахын хязгаар (#15), түр имэйл хориглох (#4), зургийн сан (storage).
-- Supabase → SQL Editor → New query → бүтнээр нь хуулж Run дарна.

-- 0. Хэрэглэгчийн нэр (@username) — нэг удаа сонгоно, дараа нь солигдохгүй ----------
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_uq on public.profiles (lower(username));
alter table public.profiles drop constraint if exists profiles_username_chk;
alter table public.profiles add constraint profiles_username_chk
  check (username is null or username ~ '^[a-z0-9_.]{3,20}$');

create or replace function public.set_username(p_name text)
returns text language plpgsql security definer set search_path = public as $$
declare n text := lower(trim(coalesce(p_name, '')));
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if n !~ '^[a-z0-9_.]{3,20}$' then raise exception 'USERNAME_FORMAT'; end if;
  if n in ('admin','administrator','campsite','support','moderator','root','null','undefined') then raise exception 'USERNAME_TAKEN'; end if;
  if exists (select 1 from public.profiles where id = auth.uid() and username is not null) then raise exception 'USERNAME_SET'; end if;
  if exists (select 1 from public.profiles where lower(username) = n) then raise exception 'USERNAME_TAKEN'; end if;
  update public.profiles set username = n where id = auth.uid();
  return n;
end; $$;
revoke execute on function public.set_username(text) from public, anon;
grant  execute on function public.set_username(text) to authenticated;

-- Нийтлэл бичих үед зохиогчийн нэрийг автоматаар бөглөнө
create or replace function public.stamp_author()
returns trigger language plpgsql security definer set search_path = public as $$
declare un text;
begin
  select username into un from public.profiles where id = auth.uid();
  if tg_op = 'INSERT' then
    new.user_id := auth.uid();
    new.author := un;
    if new.author is null and tg_argv[0] = 'required' then raise exception 'USERNAME_REQUIRED'; end if;
  else
    new.user_id := old.user_id; new.author := old.author;
  end if;
  return new;
end; $$;

-- 1. Мэдээлэх (spam, буруу мэдээлэл) ---------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('story','comment','camp','review','road')),
  target_id   uuid not null,
  reason      text check (reason is null or char_length(reason) <= 300),
  user_id     uuid default auth.uid() references auth.users on delete set null,
  status      text not null default 'new' check (status in ('new','done')),
  created_at  timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "report insert" on public.reports;
drop policy if exists "report admin" on public.reports;
create policy "report insert" on public.reports for insert to authenticated with check (user_id = auth.uid() and status = 'new');
create policy "report admin" on public.reports for all using (public.is_admin()) with check (public.is_admin());

-- 2. Замын нөхцөл (#11) ------------------------------------------------------------
create table if not exists public.road_reports (
  id                uuid primary key default gen_random_uuid(),
  aimag             text not null check (char_length(aimag) between 2 and 30),
  kind              text not null check (kind in ('flood','bridge','mud','snow','closed','nofuel','works','other')),
  place             text not null check (char_length(place) between 2 and 120),
  note              text check (note is null or char_length(note) <= 400),
  lat               double precision check (lat is null or lat between 40 and 53),
  lng               double precision check (lng is null or lng between 86 and 121),
  user_id           uuid references auth.users on delete set null,
  author            text,
  confirms          integer not null default 0,
  resolved          integer not null default 0,
  last_confirmed_at timestamptz not null default now(),
  hidden            boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists road_reports_active_idx on public.road_reports (last_confirmed_at desc) where not hidden;
alter table public.road_reports enable row level security;
drop trigger if exists road_author on public.road_reports;
create trigger road_author before insert or update on public.road_reports for each row execute procedure public.stamp_author('optional');

drop policy if exists "road read" on public.road_reports;
drop policy if exists "road insert" on public.road_reports;
drop policy if exists "road admin update" on public.road_reports;
drop policy if exists "road delete" on public.road_reports;
create policy "road read" on public.road_reports for select
  using ((not hidden and last_confirmed_at > now() - interval '10 days') or public.is_admin());
create policy "road insert" on public.road_reports for insert to authenticated
  with check (confirms = 0 and resolved = 0 and hidden = false
    and (select count(*) from public.road_reports r where r.user_id = auth.uid() and r.created_at > now() - interval '1 day') < 10);
create policy "road admin update" on public.road_reports for update using (public.is_admin()) with check (public.is_admin());
create policy "road delete" on public.road_reports for delete using (public.is_admin() or user_id = auth.uid());

create table if not exists public.road_votes (
  report_id  uuid not null references public.road_reports on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  vote       text not null check (vote in ('still','gone')),
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);
alter table public.road_votes enable row level security;
drop policy if exists "road votes own" on public.road_votes;
create policy "road votes own" on public.road_votes for select using (user_id = auth.uid());

create or replace function public.vote_road(p_id uuid, p_vote text)
returns json language plpgsql security definer set search_path = public as $$
declare c int; g int;
begin
  if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_vote not in ('still','gone') then raise exception 'BAD_VOTE'; end if;
  if not exists (select 1 from public.road_reports where id = p_id and not hidden) then raise exception 'NOT_FOUND'; end if;
  insert into public.road_votes (report_id, user_id, vote) values (p_id, auth.uid(), p_vote)
    on conflict (report_id, user_id) do update set vote = excluded.vote, created_at = now();
  select count(*) filter (where vote = 'still'), count(*) filter (where vote = 'gone') into c, g
    from public.road_votes where report_id = p_id;
  update public.road_reports
     set confirms = c, resolved = g,
         last_confirmed_at = case when p_vote = 'still' then now() else last_confirmed_at end,
         hidden = (g >= 2 and g > c)
   where id = p_id;
  return json_build_object('confirms', c, 'resolved', g);
end; $$;
revoke execute on function public.vote_road(uuid, text) from public, anon;
grant  execute on function public.vote_road(uuid, text) to authenticated;

-- 3. Аяллын түүх, блог (#8) ----------------------------------------------------------
create table if not exists public.stories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade,
  author     text,
  title      text not null check (char_length(title) between 3 and 120),
  body       text not null check (char_length(body) between 20 and 20000),
  cover      text check (cover is null or char_length(cover) <= 400),
  images     text[] not null default '{}' check (cardinality(images) <= 12),
  aimags     text[] not null default '{}' check (cardinality(aimags) <= 21),
  route      jsonb,
  days       integer check (days is null or days between 1 and 60),
  cost       integer check (cost is null or cost between 0 and 100000000),
  car        text check (car is null or char_length(car) <= 60),
  status     text not null default 'pending' check (status in ('draft','pending','approved','rejected')),
  admin_note text,
  likes      integer not null default 0,
  comments   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists stories_pub_idx on public.stories (status, created_at desc);
create index if not exists stories_author_idx on public.stories (author);
alter table public.stories enable row level security;
drop trigger if exists stories_author on public.stories;
create trigger stories_author before insert or update on public.stories for each row execute procedure public.stamp_author('required');

drop policy if exists "story read" on public.stories;
drop policy if exists "story insert" on public.stories;
drop policy if exists "story update own" on public.stories;
drop policy if exists "story admin update" on public.stories;
drop policy if exists "story delete" on public.stories;
create policy "story read" on public.stories for select
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy "story insert" on public.stories for insert to authenticated
  with check (status in ('draft','pending') and likes = 0 and comments = 0 and admin_note is null);
create policy "story update own" on public.stories for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and status in ('draft','pending'));
create policy "story admin update" on public.stories for update using (public.is_admin()) with check (public.is_admin());
create policy "story delete" on public.stories for delete using (user_id = auth.uid() or public.is_admin());
-- Хэрэглэгч лайк, сэтгэгдлийн тоо, админы тэмдэглэлийг өөрчилж чадахгүй
revoke update on public.stories from anon, authenticated;
grant update (title, body, cover, images, aimags, route, days, cost, car, status, updated_at) on public.stories to authenticated;

create table if not exists public.story_likes (
  story_id   uuid not null references public.stories on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);
alter table public.story_likes enable row level security;
drop policy if exists "like read own" on public.story_likes;
drop policy if exists "like insert" on public.story_likes;
drop policy if exists "like delete" on public.story_likes;
create policy "like read own" on public.story_likes for select using (user_id = auth.uid());
create policy "like insert" on public.story_likes for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.stories s where s.id = story_id and s.status = 'approved'));
create policy "like delete" on public.story_likes for delete using (user_id = auth.uid());

create table if not exists public.story_comments (
  id         uuid primary key default gen_random_uuid(),
  story_id   uuid not null references public.stories on delete cascade,
  user_id    uuid references auth.users on delete cascade,
  author     text,
  body       text not null check (char_length(body) between 1 and 1000),
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists story_comments_idx on public.story_comments (story_id, created_at);
alter table public.story_comments enable row level security;
drop trigger if exists comments_author on public.story_comments;
create trigger comments_author before insert or update on public.story_comments for each row execute procedure public.stamp_author('required');
drop policy if exists "comment read" on public.story_comments;
drop policy if exists "comment insert" on public.story_comments;
drop policy if exists "comment delete" on public.story_comments;
drop policy if exists "comment admin update" on public.story_comments;
create policy "comment read" on public.story_comments for select using (not hidden or public.is_admin());
create policy "comment insert" on public.story_comments for insert to authenticated
  with check (hidden = false and exists (select 1 from public.stories s where s.id = story_id and s.status = 'approved')
    and (select count(*) from public.story_comments c where c.user_id = auth.uid() and c.created_at > now() - interval '1 hour') < 20);
create policy "comment delete" on public.story_comments for delete using (user_id = auth.uid() or public.is_admin());
create policy "comment admin update" on public.story_comments for update using (public.is_admin()) with check (public.is_admin());

-- Лайк, сэтгэгдлийн тоог автоматаар шинэчилнэ
create or replace function public.story_counts()
returns trigger language plpgsql security definer set search_path = public as $$
declare sid uuid := coalesce(new.story_id, old.story_id);
begin
  update public.stories set
    likes = (select count(*) from public.story_likes where story_id = sid),
    comments = (select count(*) from public.story_comments where story_id = sid and not hidden)
  where id = sid;
  return null;
end; $$;
drop trigger if exists likes_count on public.story_likes;
create trigger likes_count after insert or delete on public.story_likes for each row execute procedure public.story_counts();
drop trigger if exists comments_count on public.story_comments;
create trigger comments_count after insert or delete or update on public.story_comments for each row execute procedure public.story_counts();

-- 4. Амралтын газар, кемп (#6) -------------------------------------------------------
create table if not exists public.camps (
  id           uuid primary key default gen_random_uuid(),
  aimag        text not null check (char_length(aimag) between 2 and 30),
  soum         text check (soum is null or char_length(soum) <= 60),
  near         text check (near is null or char_length(near) <= 120),
  name         text not null check (char_length(name) between 2 and 120),
  description  text check (description is null or char_length(description) <= 1000),
  phone        text check (phone is null or char_length(phone) <= 40),
  fb           text check (fb is null or fb ~ '^https?://' and char_length(fb) <= 300),
  ig           text check (ig is null or ig ~ '^https?://' and char_length(ig) <= 300),
  web          text check (web is null or web ~ '^https?://' and char_length(web) <= 300),
  price        text check (price is null or char_length(price) <= 80),
  season       text check (season is null or char_length(season) <= 60),
  capacity     integer check (capacity is null or capacity between 1 and 5000),
  services     text[] not null default '{}',
  photo        text check (photo is null or char_length(photo) <= 400),
  lat          double precision check (lat is null or lat between 40 and 53),
  lng          double precision check (lng is null or lng between 86 and 121),
  is_owner     boolean not null default false,
  verified     boolean not null default false,
  featured     boolean not null default false,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  rating       numeric(3,2) not null default 0,
  reviews      integer not null default 0,
  submitted_by uuid default auth.uid() references auth.users on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists camps_aimag_idx on public.camps (aimag, status);
alter table public.camps enable row level security;
drop policy if exists "camp read" on public.camps;
drop policy if exists "camp submit" on public.camps;
drop policy if exists "camp admin update" on public.camps;
drop policy if exists "camp admin delete" on public.camps;
create policy "camp read" on public.camps for select using (status = 'approved' or public.is_admin() or submitted_by = auth.uid());
create policy "camp submit" on public.camps for insert to authenticated
  with check (status = 'pending' and verified = false and featured = false and rating = 0 and reviews = 0 and submitted_by = auth.uid());
create policy "camp admin update" on public.camps for update using (public.is_admin()) with check (public.is_admin());
create policy "camp admin delete" on public.camps for delete using (public.is_admin());

create table if not exists public.camp_reviews (
  id         uuid primary key default gen_random_uuid(),
  camp_id    uuid not null references public.camps on delete cascade,
  user_id    uuid references auth.users on delete cascade,
  author     text,
  rating     integer not null check (rating between 1 and 5),
  body       text check (body is null or char_length(body) <= 800),
  hidden     boolean not null default false,
  created_at timestamptz not null default now(),
  unique (camp_id, user_id)
);
alter table public.camp_reviews enable row level security;
drop trigger if exists reviews_author on public.camp_reviews;
create trigger reviews_author before insert or update on public.camp_reviews for each row execute procedure public.stamp_author('required');
drop policy if exists "review read" on public.camp_reviews;
drop policy if exists "review insert" on public.camp_reviews;
drop policy if exists "review delete" on public.camp_reviews;
drop policy if exists "review admin update" on public.camp_reviews;
create policy "review read" on public.camp_reviews for select using (not hidden or public.is_admin());
create policy "review insert" on public.camp_reviews for insert to authenticated
  with check (hidden = false and exists (select 1 from public.camps c where c.id = camp_id and c.status = 'approved'));
create policy "review delete" on public.camp_reviews for delete using (user_id = auth.uid() or public.is_admin());
create policy "review admin update" on public.camp_reviews for update using (public.is_admin()) with check (public.is_admin());

create or replace function public.camp_rating()
returns trigger language plpgsql security definer set search_path = public as $$
declare cid uuid := coalesce(new.camp_id, old.camp_id);
begin
  update public.camps set
    rating = coalesce((select round(avg(rating)::numeric, 2) from public.camp_reviews where camp_id = cid and not hidden), 0),
    reviews = (select count(*) from public.camp_reviews where camp_id = cid and not hidden)
  where id = cid;
  return null;
end; $$;
drop trigger if exists camp_rating_t on public.camp_reviews;
create trigger camp_rating_t after insert or delete or update on public.camp_reviews for each row execute procedure public.camp_rating();

-- 5. AI туслах (#15): өдрийн хязгаар ------------------------------------------------
create table if not exists public.ai_usage (
  user_id uuid not null references auth.users on delete cascade,
  day     date not null,
  n       integer not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
drop policy if exists "ai usage own" on public.ai_usage;
create policy "ai usage own" on public.ai_usage for select using (user_id = auth.uid() or public.is_admin());

-- Хязгаар: үнэгүй 2, премиум 20 асуулт/өдөр; бүх хэрэглэгчийн нийлбэр 300/өдөр (зардал хамгаалах)
create or replace function public.ai_take_quota()
returns json language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); d date := (now() at time zone 'Asia/Ulaanbaatar')::date;
        prem boolean; lim int; used int; total int;
begin
  if uid is null then raise exception 'AUTH_REQUIRED'; end if;
  prem := public.is_premium();
  lim := case when prem then 20 else 2 end;
  select coalesce(sum(n), 0) into total from public.ai_usage where day = d;
  if total >= 300 then raise exception 'AI_BUSY'; end if;
  insert into public.ai_usage (user_id, day, n) values (uid, d, 0) on conflict do nothing;
  select n into used from public.ai_usage where user_id = uid and day = d for update;
  if used >= lim then raise exception 'AI_LIMIT'; end if;
  update public.ai_usage set n = n + 1 where user_id = uid and day = d;
  return json_build_object('used', used + 1, 'limit', lim, 'premium', prem);
end; $$;
revoke execute on function public.ai_take_quota() from public, anon;
grant  execute on function public.ai_take_quota() to authenticated;

create or replace function public.ai_quota()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'used', coalesce((select n from public.ai_usage where user_id = auth.uid() and day = (now() at time zone 'Asia/Ulaanbaatar')::date), 0),
    'limit', case when public.is_premium() then 20 else 2 end,
    'premium', public.is_premium());
$$;
revoke execute on function public.ai_quota() from public, anon;
grant  execute on function public.ai_quota() to authenticated;

-- 6. Түр/нэг удаагийн имэйлээр бүртгүүлэхийг хориглох (#4) ---------------------------
create or replace function public.block_disposable_email()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if split_part(lower(coalesce(new.email, '')), '@', 2) = any (array[
    'mailinator.com','guerrillamail.com','guerrillamail.net','sharklasers.com','10minutemail.com','10minutemail.net',
    'tempmail.com','temp-mail.org','temp-mail.io','tempmail.net','tempmailo.com','tempr.email','throwawaymail.com',
    'yopmail.com','yopmail.net','getnada.com','nada.email','trashmail.com','trashmail.de','dispostable.com',
    'maildrop.cc','mailnesia.com','mintemail.com','fakeinbox.com','emailondeck.com','moakt.com','mohmal.com',
    'mailcatch.com','spamgourmet.com','getairmail.com','burnermail.io','inboxkitten.com','emailfake.com',
    'tmpmail.org','tmpmail.net','minuteinbox.com','discard.email','mail.tm','mail.gw','1secmail.com',
    'luxusmail.org','dropmail.me','fakemail.net','spambox.us','mytemp.email','tempinbox.com']) then
    raise exception 'DISPOSABLE_EMAIL';
  end if;
  return new;
end; $$;
drop trigger if exists block_disposable on auth.users;
create trigger block_disposable before insert on auth.users for each row execute procedure public.block_disposable_email();

-- 7. Зургийн сан (storage): хэрэглэгч зөвхөн өөрийн хавтсанд зураг оруулна --------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 2097152, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg','image/webp','image/png'];

drop policy if exists "media upload own" on storage.objects;
drop policy if exists "media delete own" on storage.objects;
create policy "media upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- 8. Админы статистикт шинэ хүсэлтийн тоо ----------------------------------------------
create or replace function public.admin_counts()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Админ эрх шаардлагатай'; end if;
  return json_build_object(
    'stories', (select count(*) from public.stories where status = 'pending'),
    'camps',   (select count(*) from public.camps where status = 'pending'),
    'reports', (select count(*) from public.reports where status = 'new'),
    'roads',   (select count(*) from public.road_reports where not hidden and last_confirmed_at > now() - interval '10 days'),
    'ai_today',(select coalesce(sum(n), 0) from public.ai_usage where day = (now() at time zone 'Asia/Ulaanbaatar')::date));
end; $$;
