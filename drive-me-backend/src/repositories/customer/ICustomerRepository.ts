// ICustomerRepository.ts

import { Customer } from '@/models/Customer'
import { Ride } from '@/models/Ride'

export interface ICustomerRepository {
  findById(args: {
    where: { id: string }
    include: { rides: boolean }
  }): Promise<Customer | null | Omit<Customer, 'rides'>>

  save(id: string): Promise<void>
}
