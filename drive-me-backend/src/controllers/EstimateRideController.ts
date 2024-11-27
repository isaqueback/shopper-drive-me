// EstimateRideController.ts

import { FastifyReply, FastifyRequest } from 'fastify'

import { EstimateRideDTO } from '@/dtos/rides/EstimateRideDTO'
import { ValidationError } from '@/errors'
import { RouteEstimate } from '@/services/RideService'
import { EstimateRideUseCase } from '@/use-cases/rides/EstimateRideUseCase'

export class EstimateRideController {
  constructor(private estimateRideUseCase: EstimateRideUseCase) {}

  async handle(req: FastifyRequest, res: FastifyReply): Promise<RouteEstimate> {
    const data = EstimateRideDTO.safeParse(req.body)

    if (data.success) {
      const estimate = await this.estimateRideUseCase.execute(data.data)

      return res.send(estimate)
    }

    throw new ValidationError('INVALID_DATA', data.error.errors[0].message)
  }
}
