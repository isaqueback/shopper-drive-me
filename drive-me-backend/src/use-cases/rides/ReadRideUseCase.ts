// ReadRideUseCase.ts

import { ReadRideDTOType } from '@/dtos/rides/ReadRideDTO'
import { Driver } from '@/models/Driver'
import { Ride } from '@/models/Ride'
import { RideService } from '@/services/RideService'

export class ReadRideUseCase {
  constructor(private rideService: RideService) {}

  async execute(data: ReadRideDTOType): Promise<(Ride & { driver: Driver })[]> {
    const rides = await this.rideService.readRide(data)

    return rides
  }
}
