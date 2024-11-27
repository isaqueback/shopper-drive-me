// RideRepository.ts

import { PrismaClient } from '@prisma/client'

import { DatabaseError } from '@/errors'
import { Ride } from '@/models/Ride'

import {
  IRideRepository,
  RideWithCustomer,
  RideWithDriver,
  RideWithDriverAndCustomer,
} from './IRideRepository'

const prisma = new PrismaClient()

export class RideRepository implements IRideRepository {
  async findAll<T extends { customer?: boolean; driver?: boolean }>(args: {
    where: {
      customer_id: string
      driver_id?: number
    }
    orderBy?: {
      created_at?: 'asc' | 'desc'
    }
    include?: T
  }): Promise<
    T extends { driver: true; customer: true }
      ? RideWithDriverAndCustomer[]
      : T extends { driver: true }
        ? RideWithDriver[]
        : T extends { customer: true }
          ? RideWithCustomer[]
          : Ride[]
  > {
    try {
      const rides = await prisma.ride.findMany({
        ...args,
        include: args.include,
        orderBy: args.orderBy,
      })

      // Mapeando para converter os valores Decimal para number
      const ridesWithNumberFields = rides.map((ride) => ({
        ...ride,
        cost: ride.cost.toNumber(),
        distance: ride.distance.toNumber(),
      }))

      return ridesWithNumberFields as any
    } catch (err) {
      throw new DatabaseError(
        'DATABASE_ERROR',
        'An unknown error occurred while finding the rides',
      )
    }
  }

  async save(
    ride: Omit<Ride, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<void> {
    try {
      const newRide: Omit<Ride, 'id'> = {
        cost: ride.cost,
        created_at: new Date(),
        customer_id: ride.customer_id,
        destination: ride.destination,
        distance: ride.distance,
        driver_id: ride.driver_id,
        duration: ride.duration,
        origin: ride.origin,
        updated_at: new Date(),
      }

      await prisma.ride.create({ data: newRide })
    } catch (err: any) {
      throw new DatabaseError(
        'DATABASE_ERROR',
        'An unknown error occurred while saving the ride',
      )
    }
  }
}
