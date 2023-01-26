import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "johndoe@email.com",
      firstName: "John",
      lastName: "Doe",
      social: {
        facebook: "johndoe",
        twitter: "johndoe",
      }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e: Error) => {
    console.error(e.message)
    await prisma.$disconnect()
    process.exit(1)
  })