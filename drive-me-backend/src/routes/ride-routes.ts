// ride-routes.ts

import { FastifyInstance, FastifyRequest } from 'fastify'

import { diContainer } from '@/containers'

export async function rideRoutes(fastify: FastifyInstance) {
  const { estimateRideController, confirmRideController, readRideController } =
    diContainer.ride

  // POST /ride/estimate
  fastify.post('/estimate', (req, res) =>
    estimateRideController.handle(req, res),
  )

  // PATH /ride/confirm
  fastify.patch('/confirm', (req, res) =>
    confirmRideController.handle(req, res),
  )

  // GET /ride/:customer_id?driver_id={driver-id}
  fastify.get(
    '/:customer_id',
    (
      req: FastifyRequest<{
        Querystring: {
          driver_id: number
        }
        Params: {
          customer_id: string
        }
      }>,
      res,
    ) => readRideController.handle(req, res),
  )
}
