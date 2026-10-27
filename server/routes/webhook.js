import pool from '../db.js'
import { getStripe } from '../stripe.js'

export function stripeWebhook(req, res, next) {
  let event
  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch {
    res.status(400).json({ error: 'Invalid signature' })
    return
  }

  if (event.type !== 'checkout.session.completed') {
    res.json({ received: true })
    return
  }

  const session = event.data.object
  if (session.payment_status !== 'paid') {
    res.json({ received: true })
    return
  }

  const orderId = session.metadata?.orderId
  if (!orderId) {
    res.status(400).json({ error: 'Missing order id' })
    return
  }

  pool.query(
    `update orders set status = 'paid' where id = $1 and status = 'pending'`,
    [orderId],
  ).then(() => {
    res.json({ received: true })
  }).catch(next)
}
