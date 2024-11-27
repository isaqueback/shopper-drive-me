// ReadRideDTO.ts

import z from 'zod'

export const ReadRideDTO = z.object({
  customer_id: z
    .string({ message: 'Customer id must be a string' })
    .min(1, 'Customer id is required'),
  driver_id: z.coerce
    .number({ message: 'driver id must be a number' })
    .int({ message: 'driver is must be a integer number' })
    .positive({ message: 'driver id must be a positive number' })
    .min(1, 'driver id is required')
    .optional(),
})

export type ReadRideDTOType = z.infer<typeof ReadRideDTO>
