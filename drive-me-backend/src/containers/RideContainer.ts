// RideContainer.ts

import { ConfirmRideController } from '@/controllers/ConfirmRideController'
import { EstimateRideController } from '@/controllers/EstimateRideController'
import { ReadRideController } from '@/controllers/ReadRideController'
import { RouteProvider } from '@/providers/RouteProvider'
import { CustomerRepository } from '@/repositories/customer/CustomerRepository'
import { DriverRepository } from '@/repositories/driver/DriverRepository'
import { RideRepository } from '@/repositories/ride/RideRepository'
import { RideService } from '@/services/RideService'
import { ConfirmRideUseCase } from '@/use-cases/rides/ConfirmRideUseCase'
import { EstimateRideUseCase } from '@/use-cases/rides/EstimateRideUseCase'
import { ReadRideUseCase } from '@/use-cases/rides/ReadRideUseCase'

export class RideContainer {
  estimateRideController: EstimateRideController
  confirmRideController: ConfirmRideController
  readRideController: ReadRideController

  constructor() {
    // Repositories
    const driverRepository = new DriverRepository()
    const rideRepository = new RideRepository()
    const customerRepository = new CustomerRepository()

    // Providers
    const routeProvider = new RouteProvider()

    // Services
    const rideService = new RideService(
      routeProvider,
      driverRepository,
      rideRepository,
      customerRepository,
    )

    // Use cases
    const estimateRideUseCase = new EstimateRideUseCase(rideService)
    const confirmRideUseCase = new ConfirmRideUseCase(rideService)
    const readRideUseCase = new ReadRideUseCase(rideService)

    // Controllers
    this.estimateRideController = new EstimateRideController(
      estimateRideUseCase,
    )
    this.confirmRideController = new ConfirmRideController(confirmRideUseCase)
    this.readRideController = new ReadRideController(readRideUseCase)
  }
}

const rideContainer = new RideContainer()

export { rideContainer }
