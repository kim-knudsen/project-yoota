import { TRPCError } from '@trpc/server'
import { PrismaEvent, PrismaOption, PrismaParticipant, PrismaVote } from '@yoota/db'
import { createMockedContext } from '../test/createMockedContext'
import { prismaMock } from '../test/jestSetup'
import { RouterInput } from '../trpc'
import { createHashFromNumber } from '../utils/hashId'
import { appRouter } from './appRouter'

const EVENT: PrismaEvent = {
    id: 1,
    createdAt: new Date('2022-09-23T22:00:00.000Z'),
    updatedAt: new Date('2022-09-23T22:00:00.000Z'),
    name: 'Awesome event',
    description: 'Awesome description',
    state: 'OPEN',
    userId: 'cl8hka03n0000zdllmdh7n3gg',
    timeZoneId: 1
}

const EVENT_ID = createHashFromNumber(EVENT.id)

const OPTIONS: PrismaOption[] = [
    {
        id: 1,
        startAt: new Date('2022-09-23T22:00:00.000Z'),
        endAt: new Date('2022-09-23T22:00:00.000Z'),
        eventId: 1
    },
    {
        id: 2,
        startAt: new Date('2022-09-29T22:00:00.000Z'),
        endAt: new Date('2022-09-29T22:00:00.000Z'),
        eventId: 1
    },
    {
        id: 3,
        startAt: new Date('2022-09-27T22:00:00.000Z'),
        endAt: new Date('2022-09-27T22:00:00.000Z'),
        eventId: 1
    }
]

const PARTICIPANTS: PrismaParticipant[] = [
    { id: 1, name: 'Ali "Big Gee" Thomson', email: 'ali@express.com', eventId: 1 },
    { id: 2, name: 'Uncle Bob', email: 'bob@express.com', eventId: 1 }
]

const VOTES: PrismaVote[] = [
    {
        id: 1,
        type: 'YES',
        participantId: 1,
        optionId: 12
    },
    {
        id: 2,
        type: 'YES',
        participantId: 1,
        optionId: 12
    },
    {
        id: 3,
        type: 'YES',
        participantId: 1,
        optionId: 13
    }
]

const PARTICIPANTS_WITH_VOTES = PARTICIPANTS.map(participant => ({
    id: createHashFromNumber(participant.id),
    name: participant.name,
    email: participant.email,
    votes: VOTES
}))

const PRISMA_EVENT_RESPONSE = {
    ...EVENT,
    options: OPTIONS,
    participants: PARTICIPANTS_WITH_VOTES
}

test('get event by id is public avaiable', async () => {
    prismaMock.event.findUnique.mockResolvedValue(PRISMA_EVENT_RESPONSE)

    const context = createMockedContext()
    const caller = appRouter.createCaller({ ...context, session: null })
    const event = await caller.event.byId({ id: EVENT_ID })

    expect(event.id).toEqual(EVENT_ID)
})

test('expect 404 if id does not exist', async () => {
    const context = createMockedContext()
    const caller = appRouter.createCaller({ ...context, session: null })

    await expect(caller.event.byId({ id: EVENT_ID })).rejects.toEqual(new TRPCError({ code: 'NOT_FOUND' }))
})

test('create event', async () => {
    prismaMock.event.create.mockResolvedValue(PRISMA_EVENT_RESPONSE)
    const caller = appRouter.createCaller(createMockedContext())

    const eventPayload: RouterInput['event']['create'] = {
        name: 'My event',
        options: [],
        timeZoneId: 1
    }

    const event = await caller.event.create(eventPayload)

    expect(event).toBeTruthy()
    expect(typeof event.id === 'string').toEqual(true)
})

test('only users can create events', async () => {
    const context = createMockedContext()
    const caller = appRouter.createCaller({ ...context, session: null })

    const event: RouterInput['event']['create'] = {
        name: 'My event',
        options: [],
        timeZoneId: 1
    }

    await expect(caller.event.create(event)).rejects.toEqual(new TRPCError({ code: 'UNAUTHORIZED' }))
})
