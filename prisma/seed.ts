import { PrismaClient } from '@prisma/client'
import { add } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  await prisma.testResult.deleteMany()
  await prisma.courseEnrollment.deleteMany()
  await prisma.test.deleteMany()
  await prisma.user.deleteMany()
  await prisma.course.deleteMany()

  const john = await prisma.user.create({
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
      },
      members: {
        create: {
          role: 'TEACHER',
          user: {
            connect: { email: john.email }
          }
        }
      }
    },
    include: {
      tests: true,
      members: { include: { user: true } }
    }
  })

  const shakuntala = await prisma.user.create({
    data: {
      email: "devi@prisma.io",
      firstName: "Shakuntala",
      lastName: "Devi",
      courses: {
        create: {
          role: 'STUDENT',
          course: {
            connect: { id: course.id }
          },
        },
      },
    },
  })

  const david = await prisma.user.create({
    data: {
      email: 'david@prisma.io',
      firstName: 'David',
      lastName: 'Deutsch',
      courses: {
        create: {
          role: 'STUDENT',
          course: {
            connect: { id: course.id },
          },
        },
      },
    },
  })

  const testResultsDavid = [650, 900, 950]
  const testResultsShakuntala = [800, 950, 910]

  let counter = 0
  for (const test of course.tests) {
    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: john.email },
        },
        student: {
          connect: { email: shakuntala.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsShakuntala[counter],
      },
    })

    await prisma.testResult.create({
      data: {
        gradedBy: {
          connect: { email: john.email },
        },
        student: {
          connect: { email: david.email },
        },
        test: {
          connect: { id: test.id },
        },
        result: testResultsDavid[counter],
      },
    })

    counter++
  }
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