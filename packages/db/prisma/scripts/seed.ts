import { EventState, PrismaClient, VoteType } from '@prisma/client'
import { omit } from '@yoota/common'
import timezones from './timezones.json'
import users from './users.json'

type Users = typeof users
type User = Users[0]
type Event = User['events'][0]

const prisma = new PrismaClient()

async function main() {
    for (const ts of timezones) {
        await prisma.timeZone.upsert({
            where: { value: ts.value },
            update: {},
            create: {
                value: ts.value,
                abbr: ts.abbr,
                offset: ts.offset,
                isdst: ts.isdst,
                text: ts.text,
                utc: ts.utc
            }
        })
    }

    for (const user of users) {
        const createdUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                name: user.name,
                image: user.image,
                accounts: { createMany: { data: user.accounts.map(({ id, userId, ...rest }) => ({ ...rest })) } }
            }
        })

        const events = user.events.map(event => omitIdsFromEvent(event))

        for (const event of events) {
            const createdEvent = await prisma.event.create({
                data: {
                    name: event.name,
                    state: event.state,
                    timeZoneId: event.timeZoneId,
                    description: event.description,
                    options: { createMany: { data: event.options } },
                    userId: createdUser.id
                },
                include: { options: true }
            })

            const getRandomOptionId = () =>
                createdEvent.options[Math.floor(Math.random() * createdEvent.options.length)].id

            for (const { email, name, votes } of event.participants) {
                await prisma.participant.create({
                    data: {
                        email,
                        name,
                        eventId: createdEvent.id,
                        votes: { createMany: { data: votes.map(vote => ({ ...vote, optionId: getRandomOptionId() })) } }
                    }
                })
            }
        }
    }
}

const omitIdsFromEvent = (event: Event) => {
    const e = omit(event, 'id', 'userId')
    const state = e.state as EventState
    const options = e.options.map(option => {
        const o = omit(option, 'id', 'eventId')

        return { startAt: new Date(o.startAt), endAt: new Date(o.endAt) }
    })
    const participants = e.participants.map(participant => {
        const p = omit(participant, 'id')
        const votes = p.votes.map(v => {
            const vo = omit(v, 'id', 'participantId')
            return { ...vo, type: vo.type as VoteType }
        })
        return { ...p, votes }
    })

    return { ...e, state, options, participants }
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
