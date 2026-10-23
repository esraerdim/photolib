import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import worksRouter from './routes/works.js'
import contactRouter from './routes/contact.js'

const app = express()
const port = process.env.PORT || 3001
const clientOrigin = process.env.CLIENT_ORIGIN?.replace(/\/$/, '')

app.use(cors({
  origin: clientOrigin,
  credentials: true,
}))

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/works', worksRouter)
app.use('/api/contact', contactRouter)

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`)
})
