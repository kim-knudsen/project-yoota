import { baseProcedure, router } from '../trpc/trpc'
import { assertUser } from './utils/assertUser'

export const meRouter = router({
    me: baseProcedure.query(async ({ ctx: { session } }) => {
        assertUser(session)
        return session.user
    })
})
