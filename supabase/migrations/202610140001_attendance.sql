create extension if not exists pgcrypto;

create table if not exists public.delegates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null,
  qr_token_hash text not null unique,
  created_at timestamptz not null default now(),
  constraint delegates_email_unique unique (email)
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  delegate_id uuid not null references public.delegates(id) on delete cascade,
  conference_day smallint not null check (conference_day between 1 and 3),
  checked_in_at timestamptz not null default now(),
  checked_in_by text not null,
  constraint attendance_one_per_day unique (delegate_id, conference_day)
);

alter table public.delegates enable row level security;
alter table public.attendance enable row level security;

-- All reads and writes go through authenticated Astro server endpoints using
-- the Supabase service role. No direct browser access is granted.
revoke all on public.delegates, public.attendance from anon, authenticated;

