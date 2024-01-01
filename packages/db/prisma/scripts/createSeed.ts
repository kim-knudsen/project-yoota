import { PrismaClient } from '@prisma/client'
import { writeJSON } from 'fs-extra'

const prisma = new PrismaClient()

const print = <T>(value: T) => console.log(JSON.stringify(value, null, 2))

async function main() {
    const users = await prisma.user.findMany({
        include: { events: { include: { options: true, participants: { include: { votes: true } } } }, accounts: true }
    })

    print(users)

    await writeJSON('./prisma/scripts/users.json', users, { spaces: 4 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
