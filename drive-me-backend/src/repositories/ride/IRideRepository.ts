// IRideRepository.ts

import { Customer } from '@/models/Customer'
import { Driver } from '@/models/Driver'
import { Ride } from '@/models/Ride'

export type RideWithDriver = Ride & { driver: Driver }
export type RideWithCustomer = Ride & { customer: Customer }
export type RideWithDriverAndCustomer = Ride & {
  driver: Driver
  customer: Customer
}

export interface IRideRepository {
  findAll<T extends { customer?: boolean; driver?: boolean }>(args: {
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
  >
  save(ride: Omit<Ride, 'id' | 'created_at' | 'updated_at'>): Promise<void>
}
