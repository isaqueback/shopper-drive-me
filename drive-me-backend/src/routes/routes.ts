// routes.ts

import { FastifyInstance } from 'fastify'

import { rideRoutes } from './ride-routes'

export async function routes(fastify: FastifyInstance) {
  // Ride routes
  fastify.register(rideRoutes, {
    prefix: 'ride',
  })
}
