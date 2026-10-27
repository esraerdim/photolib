import { Router } from 'express'
import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '../auth.js'
import pool from '../db.js'

const router = Router()

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

async function signedInUser(req) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })
  return session?.user ?? null
}

async function workExists(id) {
  const found = await pool.query('select id from works where id = $1', [id])
  return found.rowCount > 0
}

router.get('/', catchErrors(async (req, res) => {
  const user = await signedInUser(req)
  const result = await pool.query(
    `select
       w.id, w.title, w.place, w.year, w.src, w.alt, w.width, w.height, w.price_cents,
       coalesce(r.value, 0)::int as rating,
       (s.work_id is not null) as saved
     from works w
     left join ratings r on r.work_id = w.id and r.user_id = $1
     left join saves s on s.work_id = w.id and s.user_id = $1
     order by w.year desc, w.id`,
    [user?.id ?? ''],
  )
  res.json(result.rows)
}))

router.put('/:id/rating', catchErrors(async (req, res) => {
  const user = await signedInUser(req)
  if (!user) {
    res.status(401).json({ error: 'Sign in to rate a photograph' })
    return
  }

  const value = req.body?.value
  if (!Number.isInteger(value) || value < 0 || value > 5) {
    res.status(400).json({ error: 'Rating must be a whole number from 0 to 5' })
    return
  }

  if (!(await workExists(req.params.id))) {
    res.status(404).json({ error: 'Photograph not found' })
    return
  }

  if (value === 0) {
    await pool.query('delete from ratings where user_id = $1 and work_id = $2', [user.id, req.params.id])
  } else {
    await pool.query(
      `insert into ratings (user_id, work_id, value)
       values ($1, $2, $3)
       on conflict (user_id, work_id) do update set value = excluded.value`,
      [user.id, req.params.id, value],
    )
  }

  res.json({ id: req.params.id, rating: value })
}))

router.put('/:id/save', catchErrors(async (req, res) => {
  const user = await signedInUser(req)
  if (!user) {
    res.status(401).json({ error: 'Sign in to save a photograph' })
    return
  }

  const saved = req.body?.saved
  if (typeof saved !== 'boolean') {
    res.status(400).json({ error: 'saved must be true or false' })
    return
  }

  if (!(await workExists(req.params.id))) {
    res.status(404).json({ error: 'Photograph not found' })
    return
  }

  if (saved) {
    await pool.query(
      `insert into saves (user_id, work_id)
       values ($1, $2)
       on conflict (user_id, work_id) do nothing`,
      [user.id, req.params.id],
    )
  } else {
    await pool.query('delete from saves where user_id = $1 and work_id = $2', [user.id, req.params.id])
  }

  res.json({ id: req.params.id, saved })
}))

export default router
