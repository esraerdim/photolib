import { Router } from 'express'
import pool from '../db.js'
import { requireUser } from '../requireUser.js'

const router = Router()

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

router.get('/session/:sessionId', requireUser, catchErrors(async (req, res) => {
  const result = await pool.query(
    `select o.id, o.status,
            i.work_id, i.title, i.unit_price_cents, i.quantity
     from orders o
     join order_items i on i.order_id = o.id
     where o.stripe_session_id = $1 and o.user_id = $2
     order by i.id`,
    [req.params.sessionId, req.user.id],
  )

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
    })),
  })
}))

export default router
