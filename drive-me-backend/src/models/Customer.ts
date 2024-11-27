// Customer.ts

import { Ride } from './Ride'

export class Customer {
  public id!: string
  public rides!: Ride[]
  public created_at!: Date
  public updated_at!: Date

  constructor(data: Customer) {
    Object.assign(this, data)
  }
}
