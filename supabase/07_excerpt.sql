-- 7-р алхам: түүхийн жагсаалтад богино хэсэг (excerpt) харуулах
alter table public.stories add column if not exists excerpt text generated always as (left(body, 240)) stored;
