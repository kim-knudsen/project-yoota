import { baseProcedure, router } from '../trpc/trpc'
import { assertUser } from './utils/assertUser'

export const signOutRouter = router({
    signOut: baseProcedure.mutation(async ({ ctx: { session, prisma } }) => {
        assertUser(session)

        await prisma.session.delete({ where: { sessionToken: session.token } })

        return true
    })
})
