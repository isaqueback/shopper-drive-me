// server.ts

import { fastify } from './app'
import { env } from './env'

try {
  fastify.listen({ host: env.HOST, port: env.PORT }, () =>
    console.log(`🚀 Server is running on port ${env.PORT}...`),
  )
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
