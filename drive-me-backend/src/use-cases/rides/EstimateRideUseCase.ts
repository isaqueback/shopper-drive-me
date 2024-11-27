// EstimateRideUseCase.ts

import { EstimateRideDTOType } from '@/dtos/rides/EstimateRideDTO'
import { RideService, RouteEstimate } from '@/services/RideService'

export class EstimateRideUseCase {
  constructor(private rideService: RideService) {}

  async execute(data: EstimateRideDTOType): Promise<RouteEstimate> {
    const estimate = await this.rideService.getEstimate(data)

    return estimate
  }
}
