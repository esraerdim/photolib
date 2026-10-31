import path from 'node:path'
import { access } from 'node:fs/promises'
import { Router } from 'express'
import pool from '../db.js'
import { requireUser } from '../requireUser.js'

const imagesRoot = path.resolve(import.meta.dirname, '../../client/public')

const router = Router()

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function photographFile(src) {
  if (typeof src !== 'string' || !src.startsWith('/assets/img/') || src.includes('..')) return null
  const file = path.resolve(imagesRoot, src.slice(1))
  if (file !== imagesRoot && !file.startsWith(`${imagesRoot}${path.sep}`)) return null
  return file
}

function downloadName(title, src) {
  const ext = path.extname(src).toLowerCase()
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg'
  const base = String(title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'photograph'
  return `${base}${safeExt}`
}

const orderSelect = `
  select o.id, o.status,
         i.work_id, i.title, i.unit_price_cents, i.quantity,
         w.src, w.alt, w.place, w.year, w.width, w.height
  from orders o
  join order_items i on i.order_id = o.id
  left join works w on w.id = i.work_id
  where o.stripe_session_id = $1 and o.user_id = $2`

router.get('/session/:sessionId/items/:workId/file', requireUser, catchErrors(async (req, res) => {
  const result = await pool.query(
    `${orderSelect} and i.work_id = $3`,
    [req.params.sessionId, req.user.id, req.params.workId],
  )
  const row = result.rows[0]
  if (!row) {
    res.status(404).json({ error: 'Order not found' })
    return
  }
  if (row.status !== 'paid') {
    res.status(403).json({ error: 'This photograph is available after payment' })
    return
  }

  const file = photographFile(row.src)
  if (!file) {
    res.status(404).json({ error: 'Photograph file not found' })
    return
  }
  try {
    await access(file)
  } catch {
    res.status(404).json({ error: 'Photograph file not found' })
    return
  }

  res.download(file, downloadName(row.title, row.src))
}))

router.get('/session/:sessionId', requireUser, catchErrors(async (req, res) => {
  const result = await pool.query(`${orderSelect} order by i.id`, [req.params.sessionId, req.user.id])

  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Order not found' })
    return
  }

  res.json({
    id: result.rows[0].id,
    status: result.rows[0].status,
    items: result.rows.map((row) => ({
      workId: row.work_id,
      title: row.title,
      unitPriceCents: row.unit_price_cents,
      quantity: row.quantity,
      src: row.src,
      alt: row.alt,
      place: row.place,
      year: row.year,
      width: row.width,
      height: row.height,
    })),
  })
}))

export default router
