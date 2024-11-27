// Driver.ts

import { Car } from './Car'
import { Ride } from './Ride'

export class Driver {
  public id!: number
  public name!: string
  public description!: string | null
  public rating!: number | null
  public review!: string | null
  public rate_per_km!: number
  public min_ride_km!: number
  public created_at!: Date
  public updated_at!: Date
  public cars!: Car[]
  public rides!: Ride[]

  constructor(data: Driver) {
    Object.assign(this, data)
  }
}
