import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import worksRouter from './routes/works.js'
import contactRouter from './routes/contact.js'
import checkoutRouter from './routes/checkout.js'
import ordersRouter from './routes/orders.js'
import adminRouter from './routes/admin.js'
import { stripeWebhook } from './routes/webhook.js'

const app = express()
const port = process.env.PORT || 3001
const clientOrigins = (process.env.CLIENT_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || clientOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(null, false)
  },
  credentials: true,
}))

app.all('/api/auth/*splat', toNodeHandler(auth))

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/works', worksRouter)
app.use('/api/contact', contactRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/admin', adminRouter)

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})
