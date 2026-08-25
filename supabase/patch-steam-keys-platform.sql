alter table public.steam_keys
  add column if not exists platform text not null default 'steam';

update public.steam_keys
set platform = 'steam'
where platform is null or platform = '';

drop index if exists steam_keys_title_region_key;

create unique index if not exists steam_keys_platform_title_region_key
  on public.steam_keys (platform, title, region);

create index if not exists steam_keys_platform_active_sort_idx
  on public.steam_keys (platform, active, sort_order, title);
