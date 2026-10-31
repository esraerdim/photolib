import { Router } from 'express'
import pool from '../db.js'
import { requireUser } from '../requireUser.js'
import { getStripe } from '../stripe.js'

const router = Router()

function catchErrors(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

function siteOrigin() {
  return (process.env.CLIENT_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)[0] ?? ''
}

router.post('/', requireUser, catchErrors(async (req, res) => {
  const workId = req.body?.workId
  if (typeof workId !== 'string' || !workId) {
    res.status(400).json({ error: 'workId is required' })
    return
  }

  const origin = siteOrigin()
  if (!origin) {
    res.status(500).json({ error: 'CLIENT_ORIGIN is not set' })
    return
  }

  // Price comes from the works row. A price sent by the browser is ignored.
  const found = await pool.query(
    'select id, title, price_cents from works where id = $1',
    [workId],
  )
  const work = found.rows[0]
  if (!work) {
    res.status(404).json({ error: 'Photograph not found' })
    return
  }
  if (!Number.isInteger(work.price_cents) || work.price_cents < 1) {
    res.status(400).json({ error: 'This photograph is not for sale' })
    return
  }

  const owned = await pool.query(
    `select 1
     from orders o
     join order_items i on i.order_id = o.id
     where o.user_id = $1 and o.status = 'paid' and i.work_id = $2
     limit 1`,
    [req.user.id, work.id],
  )
  if (owned.rowCount > 0) {
    res.status(409).json({ error: 'You already own this photograph' })
    return
  }

  const client = await pool.connect()
  let orderId
  try {
    await client.query('begin')
    const order = await client.query(
      'insert into orders (user_id) values ($1) returning id',
      [req.user.id],
    )
    orderId = order.rows[0].id
    await client.query(
      `insert into order_items (order_id, work_id, title, unit_price_cents, quantity)
       values ($1, $2, $3, $4, 1)`,
      [orderId, work.id, work.title, work.price_cents],
    )
    await client.query('commit')
  } catch (err) {
    await client.query('rollback')
    throw err
  } finally {
    client.release()
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    client_reference_id: String(orderId),
    metadata: { orderId: String(orderId) },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: work.price_cents,
        product_data: { name: `${work.title} print` },
      },
    }],
    success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancel`,
  })

  await pool.query(
    'update orders set stripe_session_id = $1 where id = $2',
    [session.id, orderId],
  )

  res.json({ url: session.url })
}))

export default router
