// ConfirmRideDTO.ts

import z from 'zod'

export const ConfirmRideDTO = z
  .object({
    customer_id: z.coerce
      .string({ message: 'Customer id must be a string' })
      .min(1, 'Customer id is required'),
    destination: z
      .string({ message: 'Destination must be a string' })
      .min(1, 'Destination is required'),
    distance: z.coerce
      .number({ message: 'Distance must be a number' })
      .positive({ message: 'Distance must be a positive number' }),
    driver: z.object({
      id: z.coerce
        .number({ message: 'Driver id must be a number' })
        .int({ message: 'Driver id must be a integer number' })
        .positive({ message: 'Driver id must be a positive number' })
        .min(1, 'Driver id is required'),
      name: z
        .string({ message: 'Driver name must be a string' })
        .min(1, 'Driver name is required'),
    }),
    duration: z.string().min(1),
    origin: z.string().min(1),
    value: z.coerce.number(),
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

export type ConfirmRideDTOType = z.infer<typeof ConfirmRideDTO>
