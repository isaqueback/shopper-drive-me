// RideService.ts

import { ConfirmRideDTOType } from '@/dtos/rides/ConfirmRideDTO'
import { EstimateRideDTOType } from '@/dtos/rides/EstimateRideDTO'
import { ReadRideDTOType } from '@/dtos/rides/ReadRideDTO'
import {
  CustomError,
  NotAcceptableError,
  NotFoundError,
  ValidationError,
} from '@/errors'
import { Driver } from '@/models/Driver'
import { Ride } from '@/models/Ride'
import { GoogleRouteResponse, RouteProvider } from '@/providers/RouteProvider'
import { CustomerRepository } from '@/repositories/customer/CustomerRepository'
import { DriverRepository } from '@/repositories/driver/DriverRepository'
import { RideRepository } from '@/repositories/ride/RideRepository'

export interface RouteEstimate {
  destination: {
    latitude: number
    longitude: number
  }
  origin: {
    latitude: number
    longitude: number
  }
  distance: number
  duration: string
  routeResponse: GoogleRouteResponse
  options: {
    id: number
    name: string
    description: string | null
    vehicle: string
    review: {
      rating: number | null
      comment: string | null
    }
    value: number
  }[]
}

export class RideService {
  constructor(
    private routeProvider: RouteProvider,
    private driverRepository: DriverRepository,
    private rideRepository: RideRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async getEstimate(data: EstimateRideDTOType): Promise<RouteEstimate> {
    const { origin, destination } =
      await this.routeProvider.getCoordinatesFromAddresses(
        data.origin,
        data.destination,
      )

    if (
      origin.latitude === destination.latitude &&
      origin.longitude === destination.longitude
    )
      throw new ValidationError(
        'INVALID_DATA',
        'Origin and destination cannot be the same',
      )

    const distance = await this.routeProvider.getDistance({
      destination,
      origin,
    }) // in meters
    const distanceInKilometers = distance / 1000

    const duration = await this.routeProvider.getDuration({
      destination,
      origin,
    })

    const driversOptions = await this.driverRepository.findAll({
      where: {
        min_ride_km: {
          lte: distanceInKilometers,
        },
      },
    })

    const options = driversOptions.map((option) => {
      return {
        description: option.description,
        id: option.id,
        name: option.name,
        review: {
          comment: option.review,
          rating: option.rating,
        },
        value: option.rate_per_km * distanceInKilometers,
        vehicle: option.cars[0].name,
      }
    })

    // Google's Response
    const routeResponse = await this.routeProvider.calculateRoute(
      origin,
      destination,
    )

    const estimate: RouteEstimate = {
      destination,
      distance,
      duration,
      options,
      origin,
      routeResponse,
    }

    return estimate
  }

  async confirmRide({
    customer_id,
    destination,
    distance,
    driver,
    duration,
    origin,
    value: cost,
  }: ConfirmRideDTOType): Promise<{ success: boolean }> {
    const route = await this.routeProvider.getCoordinatesFromAddresses(
      origin,
      destination,
    )

    if (
      route.origin.latitude === route.destination.latitude &&
      route.origin.longitude === route.destination.longitude
    ) {
      throw new ValidationError(
        'INVALID_DATA',
        'Origin and destination cannot be the same',
      )
    }

    const validedDriver = await this.driverRepository.findById(driver.id)

    if (!validedDriver) {
      throw new NotFoundError('DRIVER_NOT_FOUND', '')
    }

    if (validedDriver.min_ride_km > distance)
      throw new NotAcceptableError('INVALID_DISTANCE', '')

    const newRide: Omit<Ride, 'id' | 'created_at' | 'updated_at'> = {
      cost,
      customer_id,
      destination,
      distance,
      driver_id: driver.id,
      duration,
      origin,
    }

    const customer = await this.customerRepository.findById({
      where: { id: customer_id },
    })

    if (customer) {
      await this.rideRepository.save(newRide)
    } else {
      await this.customerRepository.save(customer_id)
      await this.rideRepository.save(newRide)
    }

    return { success: true }
  }

  async readRide(
    data: ReadRideDTOType,
  ): Promise<(Ride & { driver: Driver })[]> {
    if (data.driver_id) {
      const driver = await this.driverRepository.findById(data.driver_id)

      if (!driver)
        throw new CustomError(
          'INVALID_DRIVER',
          'Driver id must be a valid id',
          400,
        )
    }
    const rides = await this.rideRepository.findAll({
      include: { driver: true },
      orderBy: {
        created_at: 'desc',
      },
      where: {
        customer_id: data.customer_id,
        driver_id: data.driver_id,
      },
    })

    return rides
  }
}
