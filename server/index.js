import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import worksRouter from './routes/works.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}))

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/works', worksRouter)

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
