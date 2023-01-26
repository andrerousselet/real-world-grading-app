import { PrismaClient } from '@prisma/client'
import { add } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // const user = await prisma.user.create({
  //   data: {
  //     email: "johndoe@email.com",
  //     firstName: "John",
  //     lastName: "Doe",
  //     social: {
  //       facebook: "johndoe",
  //       twitter: "johndoe",
  //     }
  //   }
  // })

  await prisma.test.deleteMany()
  await prisma.course.deleteMany()

  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeeksFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 30 })

  const course = await prisma.course.create({
    data: {
      name: "CRUD with Prisma in the real world",
      courseDetails: "A soft introduction to CRUD with Prisma",
      tests: {
        createMany: {
          data: [
            { date: weekFromNow, name: "First test" },
            { date: twoWeeksFromNow, name: "Second test" },
            { date: monthFromNow, name: "Final exam" },
          ]
        }
      }
    },
    include: {
      tests: true
    }
  })

  console.log(course);

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