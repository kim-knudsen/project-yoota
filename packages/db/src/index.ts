import { Event, Option, Participant, Prisma, PrismaClient, TimeZone, User, Vote } from '@prisma/client'

const prismaGlobal = global as typeof global & {
    prisma?: PrismaClient
}

/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
export const prisma: PrismaClient =
    prismaGlobal.prisma ||
    new PrismaClient({
        log: ['error']
    })

if (process.env.NODE_ENV !== 'production') {
    prismaGlobal.prisma = prisma
}

export type PrismaEvent = Event
export type PrismaTimeZone = TimeZone
export type PrismaParticipant = Participant
export type PrismaUser = User
export type PrismaOption = Option
export type PrismaVote = Vote

export const eventSelectValidator = Prisma.validator<Prisma.EventSelect>()
