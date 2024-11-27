// ConfirmRideUseCase.ts

import { ConfirmRideDTOType } from '@/dtos/rides/ConfirmRideDTO'
import { RideService } from '@/services/RideService'

export class ConfirmRideUseCase {
  constructor(private rideService: RideService) {}

  async execute(data: ConfirmRideDTOType): Promise<{ success: boolean }> {
    const confirm = await this.rideService.confirmRide(data)

    return confirm
  }
}
