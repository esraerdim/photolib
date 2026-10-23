import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const shootTypes = new Set([
  'Completed building',
  'Interior',
  'Construction progress',
  'Editorial feature',
])

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function clean(value, max) {
  return String(value ?? '')
    .trim()
    .slice(0, max)
}

router.post('/', catchErrors(async (req, res) => {
  const name = clean(req.body?.name, 120)
  const email = clean(req.body?.email, 200).toLowerCase()
  const shootType = clean(req.body?.shootType ?? req.body?.type, 80)
  const preferredDates = clean(req.body?.preferredDates ?? req.body?.dates, 200)
  const message = clean(req.body?.message, 4000)

  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required' })
  }
  if (!shootTypes.has(shootType)) {
    return res.status(400).json({ error: 'Choose a shoot type' })
  }

  const result = await pool.query(
    `insert into booking_requests (name, email, shoot_type, preferred_dates, message)
     values ($1, $2, $3, $4, $5)
     returning id, created_at`,
    [name, email, shootType, preferredDates, message],
  )

  res.status(201).json({
    ok: true,
    id: result.rows[0].id,
    createdAt: result.rows[0].created_at,
  })
}))

export default router
