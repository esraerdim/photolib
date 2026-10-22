import 'dotenv/config'
import { betterAuth } from 'better-auth'
import pool from './db.js'

const baseURL = process.env.BETTER_AUTH_URL?.replace(/\/$/, '')
const clientOrigin = process.env.CLIENT_ORIGIN?.replace(/\/$/, '')
const crossSite = baseURL?.startsWith('https://') ?? false

export const auth = betterAuth({
  database: pool,
  secret: process.env.AUTH_SECRET,
  baseURL,
  trustedOrigins: [clientOrigin].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  ...(crossSite
    ? {
        advanced: {
          defaultCookieAttributes: {
            sameSite: 'none',
            secure: true,
          },
        },
      }
    : {}),
})
