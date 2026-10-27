import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import pool from './db.js'
import { works } from '../client/src/data/works.js'

const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
await pool.query(schema)

for (const work of works) {
  await pool.query(
    `insert into works (id, title, place, year, src, alt, width, height, price_cents)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     on conflict (id) do update set
       title = excluded.title,
       place = excluded.place,
       year = excluded.year,
       src = excluded.src,
       alt = excluded.alt,
       width = excluded.width,
       height = excluded.height,
       price_cents = excluded.price_cents`,
    [work.id, work.title, work.place, work.year, work.src, work.alt, work.width, work.height, work.priceCents],
  )
}

const count = await pool.query('select count(*)::int as count from works')
console.log(`works in database: ${count.rows[0].count}`)
await pool.end()
