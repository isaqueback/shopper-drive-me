// EstimateRideDTO.ts

import z from 'zod'

export const EstimateRideDTO = z
  .object({
    customer_id: z
      .string({ message: 'Customer id must be a string' })
      .min(1, 'Customer id is required'),
    destination: z
      .string({ message: 'Destination must be a string' })
      .min(1, 'Destination is required'),
    origin: z
      .string({ message: 'Origin id must be a string' })
      .min(1, 'Origin is required'),
  })
  .refine(
    ({ origin, destination }) => {
      return origin !== destination
    },
    {
      message: 'Origin and destination cannot be the same',
      path: ['origin', 'destination'],
    },
  )

export type EstimateRideDTOType = z.infer<typeof EstimateRideDTO>
