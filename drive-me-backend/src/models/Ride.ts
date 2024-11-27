// Ride.ts

export class Ride {
  public id!: number
  public customer_id!: string
  public driver_id!: number
  public origin!: string
  public destination!: string
  public distance!: number // in metters
  public duration!: string // example '100s'
  public cost!: number
  public created_at!: Date
  public updated_at!: Date

  constructor(data: Ride) {
    Object.assign(this, data)
  }
}
