import 'dotenv/config'
import { auth } from './auth.js'
import pool from './db.js'

const context = await auth.$context
await context.runMigrations()
console.log('auth tables ready')
await pool.end()
