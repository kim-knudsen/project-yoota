import { baseProcedure, router } from '../trpc/trpc'
import { assertUser } from './utils/assertUser'

// See https://github.com/trpc/zart/blob/main/packages/api/src/routers/post.ts

export const timeZoneRouter = router({
    all: baseProcedure.query(async ({ ctx: { prisma, session } }) => {
        assertUser(session)
        return prisma.timeZone.findMany()
    })
})
