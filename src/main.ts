import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tests = await prisma.test.findMany()
  for (const test of tests) {
    const results = await prisma.testResult.aggregate({
      where: {
        testId: test?.id,
      },
      _avg: { result: true },
      _max: { result: true },
      _min: { result: true },
      _count: true,
    })
    console.log(`test: ${test.name} (id: ${test.id})`, results)
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