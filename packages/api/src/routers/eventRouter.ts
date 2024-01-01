import { TRPCError } from '@trpc/server'
import { assertIsDefined, assertTruthy, omit } from '@yoota/common'
import { eventSelectValidator } from '@yoota/db'
import { createConsoleLogger } from '@yoota/logger'
import { z } from 'zod'
import { baseProcedure, router } from '../trpc/trpc'
import { createHashFromNumber, createNumberFromHash, withHashId } from '../utils/hashId'

import { assertUser } from './utils/assertUser'

const log = createConsoleLogger('eventRouter')

const stringOrDate = z.string().or(z.date())
const dateRange = z.object({
    endAt: stringOrDate,
    startAt: stringOrDate
})

/**
 * Default selector for Event.
 *
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultEventSelect = eventSelectValidator({
    id: true,
    name: true,
    description: true,
    state: true,
    timeZoneId: true
})

export const eventRouter = router({
    byId: baseProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx: { prisma } }) => {
            const numericId = createNumberFromHash(input.id)
            const event = await prisma.event.findUnique({
                where: { id: numericId },
                include: {
                    options: { select: { id: true, startAt: true, endAt: true } },
                    participants: {
                        select: { id: true, name: true, email: true, votes: { select: { type: true, optionId: true } } }
                    }
                }
            })

            assertIsDefined(event, new TRPCError({ code: 'NOT_FOUND' }))

            const hashedParticipants = event.participants.map(withHashId)

            return withHashId(omit({ ...event, participants: hashedParticipants }, 'userId'))
        }),

    organizing: baseProcedure.query(async ({ ctx: { prisma, session } }) => {
        assertUser(session)

        const events = await prisma.event.findMany({
            where: { userId: session.userId },
            select: { id: true, name: true, description: true }
        })

        return events.map(withHashId)
    }),

    participating: baseProcedure
        .input(z.object({ participantIds: z.array(z.string()) }))
        .query(async ({ input, ctx: { prisma } }) => {
            const numericIds = input.participantIds.map(createNumberFromHash)

            const events = await prisma.event.findMany({
                where: { participants: { every: { id: { in: numericIds } } } },
                select: { id: true, name: true, description: true }
            })

            return events.map(withHashId)
        }),
    create: baseProcedure
        .input(
            z.object({
                name: z.string().min(3),
                description: z.string().min(1).optional(),
                timeZoneId: z.number(),
                options: z.array(dateRange)
            })
        )
        .mutation(async ({ input, ctx: { session, prisma } }) => {
            assertUser(session)

            const event = await prisma.event.create({
                data: {
                    userId: session.userId,
                    name: input.name,
                    description: input.description,
                    timeZoneId: input.timeZoneId,
                    state: 'OPEN',
                    options: {
                        createMany: { data: input.options }
                    }
                },
                select: defaultEventSelect
            })

            assertIsDefined(event, new TRPCError({ code: 'PRECONDITION_FAILED' }))

            log.info({ type: 'Event created', name: input.name })

            return withHashId(event)
        }),
    update: baseProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(3).optional(),
                description: z.string().min(1).optional().nullable(),
                timeZoneId: z.number().optional(),
                options: z
                    .object({
                        add: z.array(dateRange).optional(),
                        update: z
                            .array(
                                z.object({
                                    id: z.number(),
                                    startAt: stringOrDate,
                                    endAt: stringOrDate
                                })
                            )
                            .optional(),
                        delete: z.array(z.object({ id: z.number() })).optional()
                    })
                    .optional()
            })
        )
        .mutation(async ({ input, ctx: { session, prisma } }) => {
            assertUser(session)

            const eventId = createNumberFromHash(input.id)

            // TODO: Create common assertion for the case below
            try {
                await prisma.event.findFirstOrThrow({ where: { id: eventId, userId: session.userId } })
            } catch (error) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Event not found for current logged in user',
                    cause: error
                })
            }

            const event = await prisma.$transaction(async tx => {
                const { name, description, timeZoneId, options } = input

                if (options) {
                    const { add, delete: del, update } = options

                    if (nonEmpty(add)) {
                        await tx.option.createMany({ data: add.map(option => ({ ...option, eventId })) })
                    }

                    if (nonEmpty(del)) {
                        await tx.option.deleteMany({ where: { id: { in: del.map(({ id }) => id) } } })
                    }

                    if (nonEmpty(update)) {
                        await Promise.all([
                            ...update.map(option => tx.option.update({ where: { id: option.id }, data: option })),
                            // Updating existing options should also delete any existing participant votes
                            tx.vote.deleteMany({ where: { optionId: { in: update.map(({ id }) => id) } } })
                        ])
                    }
                }

                return tx.event.update({
                    where: { id: eventId },
                    data: { name, description, timeZoneId },

                    include: {
                        options: { select: { id: true, startAt: true, endAt: true } },
                        participants: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                votes: { select: { type: true, optionId: true } }
                            }
                        }
                    }
                })
            })

            const hashedParticipants = event.participants.map(withHashId)

            return withHashId(omit({ ...event, participants: hashedParticipants }, 'userId'))
        }),
    delete: baseProcedure
        .input(
            z.object({
                eventId: z.string()
            })
        )
        .mutation(async ({ input, ctx: { session, prisma } }) => {
            const eventId = createNumberFromHash(input.eventId)

            assertUser(session)

            try {
                // Ensure logged in user is the owner of the event
                await prisma.event.findFirstOrThrow({ where: { id: eventId, userId: session.userId } })
                await prisma.event.delete({ where: { id: eventId } })
            } catch (error) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Event not found for current logged in user',
                    cause: error
                })
            }
        }),
    participate: baseProcedure
        .input(
            z.object({
                eventId: z.string(),
                name: z.string(),
                email: z.string().email().optional().nullable(),
                options: z.array(z.number())
            })
        )
        .mutation(async ({ input, ctx: { prisma } }) => {
            const eventId = createNumberFromHash(input.eventId)
            const email = input.email?.trim().toLowerCase()

            // Sanity check email if defined
            if (email) {
                const existingParticipant = await prisma.participant.findFirst({
                    where: { eventId, email }
                })

                assertTruthy(
                    !existingParticipant,
                    new TRPCError({ code: 'BAD_REQUEST', message: 'Email already used' })
                )
            }

            const participant = await prisma.participant.create({
                data: {
                    name: input.name,
                    email,
                    eventId,
                    votes: {
                        createMany: {
                            data: input.options.map(optionId => ({
                                optionId,
                                type: 'YES'
                            }))
                        }
                    }
                }
            })

            return {
                id: createHashFromNumber(participant.id)
            }
        }),
    deleteParticipant: baseProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ input, ctx: { prisma } }) => {
            const numericId = createNumberFromHash(input.id)
            return prisma.participant.delete({ where: { id: numericId } })
        }),
    updateParticipant: baseProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string().min(1).optional(),
                email: z.string().email().optional().nullable(),
                votes: z.array(z.object({ optionId: z.number() })).optional()
            })
        )
        .mutation(async ({ input, ctx: { prisma } }) => {
            const numericId = createNumberFromHash(input.id)
            const email = input.email ? input.email.trim().toLocaleLowerCase() : null
            const { name } = input
            const votes = input.votes?.map(({ optionId }) => ({
                optionId,
                participantId: numericId,
                type: 'YES' as const
            }))

            return prisma.$transaction(async tx => {
                if (votes) {
                    await tx.vote.deleteMany({ where: { participantId: numericId } })
                    await tx.vote.createMany({ data: votes })
                }
                const participant = await tx.participant.update({
                    where: { id: numericId },
                    data: { name, email }
                })

                return withHashId(participant)
            })
        })
})

const nonEmpty = <T>(list: T[] | undefined): list is T[] => list !== undefined && list.length > 0
