// CustomerRepository.ts

import { PrismaClient } from '@prisma/client'
import { create } from 'domain'

import { DatabaseError } from '@/errors'
import { Customer } from '@/models/Customer'
import { Ride } from '@/models/Ride'

import { ICustomerRepository } from './ICustomerRepository'

const prisma = new PrismaClient()

export class CustomerRepository implements ICustomerRepository {
  async findById({
    where,
    include = { rides: false },
  }: {
    where: { id: string }
    include?: { rides: boolean }
  }): Promise<Customer | null | Omit<Customer, 'rides'>> {
    try {
      const customer = await prisma.customer.findUnique({ include, where })

      if (!customer) return null

      const customerWithNumberRides = {
        ...customer,
        rides: include.rides
          ? customer.rides?.map((ride) => ({
              ...ride,
              cost: ride.cost.toNumber(),
              distance: ride.distance.toNumber(),
            }))
          : undefined,
      }

      return customerWithNumberRides
    } catch (err) {
      console.error(err)
      throw new DatabaseError(
        'DATABASE_ERROR',
        'An unknown error occurred while finding the customer',
      )
    }
  }

  async save(id: string): Promise<void> {
    try {
      await prisma.customer.create({
        data: {
          id,
        },
      })
    } catch (err) {
      console.error(err)
      throw new DatabaseError(
        'DATABASE_ERROR',
        'An unknown error occurred while saving the customer',
      )
    }
  }
}
