import { fromNodeHeaders } from 'better-auth/node'
import { auth } from './auth.js'

export function requireUser(req, res, next) {
  auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  }).then((session) => {
    if (!session?.user) {
      res.status(401).json({ error: 'Sign in to buy a print' })
      return
    }
    req.user = session.user
    next()
  }).catch(next)
}
