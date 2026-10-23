import 'dotenv/config'
import { betterAuth } from 'better-auth'
import pool from './db.js'

const baseURL = process.env.BETTER_AUTH_URL?.replace(/\/$/, '')
const clientOrigins = (process.env.CLIENT_ORIGIN ?? '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)
const crossSite = baseURL?.startsWith('https://') ?? false

export const auth = betterAuth({
  database: pool,
  secret: process.env.AUTH_SECRET,
  baseURL,
  trustedOrigins: clientOrigins,
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
