// env/index.ts

import { config } from 'dotenv'
import { z } from 'zod'

config({ path: '../.env' })

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().default(8080),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(_env.error)
  throw new Error('❌ Invalid environment variables.')
}

export const env = _env.data
