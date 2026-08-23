-- Vstore Supabase foundation.
-- Run this file in Supabase SQL Editor.
-- After that, create a user in Authentication and add that user to admin_users.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default '',
  filters text[] not null default '{}',
  image text not null default '',
  featured_image text not null default '',
  featured_mobile_image text not null default '',
  featured_title text not null default '',
  aliases text[] not null default '{}',
  items text[] not null default '{}',
  price_from text not null default '',
  description text not null default '',
  accent text not null default '#8b5cf6',
  accent_rgb text not null default '139, 92, 246',
  watermark text not null default '',
  benefits jsonb not null default '[]'::jsonb,
  details jsonb not null default '[]'::jsonb,
  guarantee text not null default '',
  prices jsonb not null default '[]'::jsonb,
  regions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.steam_keys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text not null default 'Global',
  price_label text not null default '',
  price_value integer not null default 0,
  tags text[] not null default '{}',
  aliases text[] not null default '{}',
  cover text not null default '',
  editions jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.steam_keys
  add column if not exists editions jsonb not null default '[]'::jsonb;

create index if not exists products_active_sort_idx
  on public.products (active, sort_order, title);

create index if not exists steam_keys_active_sort_idx
  on public.steam_keys (active, sort_order, title);

create unique index if not exists steam_keys_title_region_key
  on public.steam_keys (title, region);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists steam_keys_set_updated_at on public.steam_keys;
create trigger steam_keys_set_updated_at
before update on public.steam_keys
for each row
execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.steam_keys enable row level security;

drop policy if exists "Admins can read own admin flag" on public.admin_users;
create policy "Admins can read own admin flag"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
on public.products
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read active steam keys" on public.steam_keys;
create policy "Public can read active steam keys"
on public.steam_keys
for select
to anon, authenticated
using (active = true);

drop policy if exists "Admins can read all steam keys" on public.steam_keys;
create policy "Admins can read all steam keys"
on public.steam_keys
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert steam keys" on public.steam_keys;
create policy "Admins can insert steam keys"
on public.steam_keys
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update steam keys" on public.steam_keys;
create policy "Admins can update steam keys"
on public.steam_keys
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete steam keys" on public.steam_keys;
create policy "Admins can delete steam keys"
on public.steam_keys
for delete
to authenticated
using (public.is_admin());

-- Replace admin@example.com with your email after creating the Auth user:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'admin@example.com'
-- on conflict (user_id) do nothing;
