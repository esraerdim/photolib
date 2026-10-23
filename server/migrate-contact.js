import 'dotenv/config'
import pool from './db.js'

await pool.query(`
  create table if not exists booking_requests (
    id bigserial primary key,
    name text not null,
    email text not null,
    shoot_type text not null,
    preferred_dates text not null default '',
    message text not null default '',
    created_at timestamptz not null default now()
  )
`)

console.log('booking_requests table ready')
await pool.end()
