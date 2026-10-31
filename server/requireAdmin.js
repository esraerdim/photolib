import { fromNodeHeaders } from 'better-auth/node'
import { isAdminEmail } from './adminEmail.js'
import { auth } from './auth.js'
import pool from './db.js'

export function requireAdmin(req, res, next) {
  auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  }).then(async (session) => {
    if (!session?.user) {
      res.status(401).json({ error: 'Sign in required' })
      return
    }

    const result = await pool.query('select role from "user" where id = $1', [session.user.id])
    const role = result.rows[0]?.role
    const admin = role === 'admin' || isAdminEmail(session.user.email)
    if (!admin) {
      res.status(403).json({ error: 'Studio access only' })
      return
    }

    req.user = { ...session.user, role: 'admin' }
    next()
  }).catch(next)
}
