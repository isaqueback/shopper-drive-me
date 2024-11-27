// IDriverRepository.ts

import { Driver } from '@/models/Driver'

export interface DriverFilters {
  name?: string
  description?: string
  rating?: { gte?: number; lte?: number; eq?: number }
  review?: string
  min_ride_km?: { gte?: number; lte?: number; eq?: number }
  rate_per_km?: { gte?: number; lte?: number; eq?: number }
  created_at?: Date
  updated_at?: Date
}

export interface IDriverRepository {
  findById(id: number): Promise<Driver | null>

  findAll(filters: { where: DriverFilters }): Promise<Driver[]>
}
