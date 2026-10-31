import { Router } from 'express'
import pool from '../db.js'
import { requireAdmin } from '../requireAdmin.js'

const router = Router()

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

router.get('/', requireAdmin, catchErrors(async (req, res) => {
  const [inquiries, paid, pending] = await Promise.all([
    pool.query(
      `select id, name, email, shoot_type, preferred_dates, message, created_at
       from booking_requests
       order by created_at desc`,
    ),
    pool.query(
      `select o.id, o.created_at, u.name as buyer_name, u.email as buyer_email,
              i.title, i.unit_price_cents, i.quantity
       from orders o
       join "user" u on u.id = o.user_id
       join order_items i on i.order_id = o.id
       where o.status = 'paid'
       order by o.created_at desc, i.id`,
    ),
    pool.query(`select count(*)::int as count from orders where status = 'pending'`),
  ])

  const orders = []
  for (const row of paid.rows) {
    const item = {
      title: row.title,
      unitPriceCents: row.unit_price_cents,
      quantity: row.quantity,
    }
    const current = orders.at(-1)
    if (current && current.id === row.id) {
      current.items.push(item)
      current.totalCents += row.unit_price_cents * row.quantity
      continue
    }
    orders.push({
      id: row.id,
      createdAt: row.created_at,
      buyerName: row.buyer_name,
      buyerEmail: row.buyer_email,
      items: [item],
      totalCents: row.unit_price_cents * row.quantity,
    })
  }

  res.json({
    inquiries: inquiries.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      shootType: row.shoot_type,
      preferredDates: row.preferred_dates,
      message: row.message,
      createdAt: row.created_at,
    })),
    orders,
    pendingCount: pending.rows[0].count,
  })
}))

export default router
