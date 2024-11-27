import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

config({ path: '../.env' })
const prisma = new PrismaClient()

// Create 3 drivers
async function createDrivers() {
  const driversData = [
    {
      description:
        'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez algunsdesvios).',
      min_ride_km: 1,
      name: 'Homer Simpson',
      rate_per_km: 2.5,
      rating: 2,
      review:
        'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
    },
    {
      description:
        'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      min_ride_km: 5,
      name: 'Dominic Toretto',
      rate_per_km: 5.0,
      rating: 4,
      review:
        'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo!',
    },
    {
      description:
        'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      min_ride_km: 10,
      name: 'James Bond',
      rate_per_km: 10.0,
      rating: 5,
      review:
        'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
    },
  ]

  for (const driverData of driversData) {
    const existingDriver = await prisma.driver.findFirst({
      where: { name: driverData.name },
    })

    if (!existingDriver) {
      await prisma.driver.create({
        data: {
          ...driverData,
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
    }
  }
}

createDrivers()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
