// ConfirmRideController.ts

import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { ConfirmRideDTO } from '@/dtos/rides/ConfirmRideDTO'
import { ValidationError } from '@/errors'
import { ConfirmRideUseCase } from '@/use-cases/rides/ConfirmRideUseCase'

export class ConfirmRideController {
  constructor(private confirmRideUseCase: ConfirmRideUseCase) {}

  async handle(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const data = ConfirmRideDTO.safeParse(req.body)

    if (data.success) {
      const confirm = await this.confirmRideUseCase.execute(data.data)

      return res.send(confirm)
    }

    throw new ValidationError('INVALID_DATA', data.error.errors[0].message)
  }
}
