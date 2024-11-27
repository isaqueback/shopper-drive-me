// ReadRideController.ts

import { FastifyReply, FastifyRequest } from 'fastify'

import { ReadRideDTO } from '@/dtos/rides/ReadRideDTO'
import { NotFoundError, ValidationError } from '@/errors'
import { ReadRideUseCase } from '@/use-cases/rides/ReadRideUseCase'

export class ReadRideController {
  constructor(private readRideUseCase: ReadRideUseCase) {}

  async handle(
    req: FastifyRequest<{
      Querystring: {
        driver_id: number
      }
      Params: {
        customer_id: string
      }
    }>,
    res: FastifyReply,
  ): Promise<void> {
    const data = ReadRideDTO.safeParse({
      customer_id: req.params.customer_id,
      driver_id: req.query.driver_id,
    })

    if (data.success) {
      const _rides = await this.readRideUseCase.execute({ ...data.data })

      if (!_rides.length) {
        throw new NotFoundError('NO_RIDES_FOUND', 'No rides found')
      }

      const rides = {
        customer_id: data.data.customer_id,
        rides: _rides.map((trip) => {
          return {
            date: trip.created_at,
            destination: trip.destination,
            distance: trip.distance,
            driver: {
              id: trip.driver_id,
              name: trip.driver.name,
            },
            duration: trip.duration,
            id: trip.id,
            origin: trip.origin,
            value: trip.cost,
          }
        }),
      }

      return res.send(rides)
    }

    const errorDetails = data.error.errors.find((err) =>
      err.path.includes('driver_id'),
    )

    // Error for driver_id
    if (errorDetails) {
      throw new ValidationError(
        'INVALID_DRIVER',
        'Driver id is invalid: ' + errorDetails.message,
      )
    }

    // Error for others fields
    throw new ValidationError('INVALID_DATA', 'Invalid data provided')
  }
}
