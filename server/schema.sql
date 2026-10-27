create table if not exists works (
  id text primary key,
  title text not null,
  place text not null,
  year integer not null,
  src text not null,
  alt text not null,
  width integer not null,
  height integer not null,
  price_cents integer not null default 0
);

alter table works add column if not exists price_cents integer not null default 0;

create table if not exists ratings (
  user_id text not null references "user" (id) on delete cascade,
  work_id text not null references works (id) on delete cascade,
  value integer not null check (value between 1 and 5),
  primary key (user_id, work_id)
);

create table if not exists saves (
  user_id text not null references "user" (id) on delete cascade,
  work_id text not null references works (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, work_id)
);

create table if not exists booking_requests (
  id bigserial primary key,
  name text not null,
  email text not null,
  shoot_type text not null,
  preferred_dates text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id bigserial primary key,
  user_id text not null references "user" (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  stripe_session_id text unique,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id bigint not null references orders (id) on delete cascade,
  work_id text not null references works (id),
  title text not null,
  unit_price_cents integer not null,
  quantity integer not null default 1 check (quantity > 0)
);
