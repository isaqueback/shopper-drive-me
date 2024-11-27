// DriverRepository.ts

import { PrismaClient } from '@prisma/client'

import { DatabaseError } from '@/errors'
import { Driver } from '@/models/Driver'

import { DriverFilters, IDriverRepository } from './IDriverRepository'

const prisma = new PrismaClient()

export class DriverRepository implements IDriverRepository {
  async findById(id: number): Promise<Driver | null> {
    try {
      const _driver = await prisma.driver.findUnique({
        include: {
          cars: true,
          rides: true,
        },
        where: { id },
      })

      if (!_driver) return null

      const driver: Driver = {
        ..._driver,
        min_ride_km: _driver.min_ride_km.toNumber(),
        rate_per_km: _driver.rate_per_km.toNumber(),
        rating: _driver.rating ? _driver.rating.toNumber() : null,
        rides: _driver.rides.map((ride) => ({
          ...ride,
          cost: ride.cost.toNumber(),
          distance: ride.distance.toNumber(),
        })),
      }

      return new Driver(driver)
    } catch (err: any) {
      throw new DatabaseError(
        'DATABASE_ERROR',
        err.message || 'An unknown error occurred',
      )
    }
  }

  async findAll(filters: { where: DriverFilters }): Promise<Driver[]> {
    try {
      const _drivers = await prisma.driver.findMany({
        include: {
          cars: true,
          rides: true,
        },
        where: filters.where,
      })

      const drivers: Driver[] = _drivers.map((_driver) => ({
        ..._driver,
        min_ride_km: _driver.min_ride_km.toNumber(),
        rate_per_km: _driver.rate_per_km.toNumber(),
        rating: _driver.rating ? _driver.rating.toNumber() : null,
        rides: _driver.rides.map((ride) => ({
          ...ride,
          cost: ride.cost.toNumber(),
          distance: ride.distance.toNumber(),
        })),
      }))

      return drivers
    } catch (err: any) {
      throw new DatabaseError(
        'DATABASE_ERROR',
        err.message || 'An unknown error occurred',
      )
    }
  }
}
