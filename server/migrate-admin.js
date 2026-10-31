import 'dotenv/config'
import { ADMIN_EMAIL } from './adminEmail.js'
import pool from './db.js'

await pool.query(`
  alter table "user" add column if not exists role text not null default 'user'
`)

const promoted = await pool.query(
  `update "user" set role = 'admin' where lower(email) = $1 returning email`,
  [ADMIN_EMAIL],
)

console.log(
  promoted.rowCount
    ? `admin: ${promoted.rows.map((row) => row.email).join(', ')}`
    : `role column ready; ${ADMIN_EMAIL} becomes admin on sign-up`,
)
await pool.end()
