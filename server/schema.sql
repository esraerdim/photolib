create table if not exists works (
  id text primary key,
  title text not null,
  place text not null,
  year integer not null,
  src text not null,
  alt text not null,
  width integer not null,
  height integer not null
);

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
