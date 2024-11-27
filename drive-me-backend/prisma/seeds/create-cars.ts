import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '../.env' })
const prisma = new PrismaClient()

// Create 3 car
async function createCars() {
  const carsData = [
    { driver_id: 1, name: 'Plymouth Valiant 1973 rosa e enferrujado' },
    { driver_id: 2, name: 'Dodge Charger R/T 1970 modificado' },
    { driver_id: 3, name: 'Aston Martin DB5 clássico' },
  ]

  for (const carData of carsData) {
    const existingCar = await prisma.car.findFirst({
      where: { name: carData.name },
    })

    if (!existingCar) {
      await prisma.car.create({
        data: {
          ...carData,
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
    }
  }
}

createCars()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
