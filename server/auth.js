import 'dotenv/config'
import { betterAuth } from 'better-auth'
import { isAdminEmail } from './adminEmail.js'
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
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isAdminEmail(user.email)) return
          return { data: { ...user, role: 'admin' } }
        },
      },
    },
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
