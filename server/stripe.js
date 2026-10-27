import Stripe from 'stripe'

let client

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!client) client = new Stripe(key)
  return client
}
