// Car

export class Car {
  public id!: number
  public name!: string
  public driver_id!: number | null
  public created_at!: Date
  public updated_at!: Date

  constructor(data: Car) {
    Object.assign(this, data)
  }
}
