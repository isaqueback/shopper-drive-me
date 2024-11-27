// app.ts

import cors from '@fastify/cors'
import Fastify from 'fastify'

import { routes } from '@/routes/routes'

import { errorHandler } from './errors/error-handler'

const fastify = Fastify()

fastify.register(routes) // all routes
fastify.register(cors, {
  origin: ['http://localhost:80', 'http://localhost'], // only this domain/origin can access this backend
})

fastify.setErrorHandler(errorHandler) // register handler for all errors

export { fastify }
