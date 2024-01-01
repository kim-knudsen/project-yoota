/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc/trpc'
import { eventRouter } from './eventRouter'
import { i18nRouter } from './i18nRouter'
import { loggerRouter } from './loggerRouter'
import { meRouter } from './meRouter'
import { signOutRouter } from './signOutRouter'
import { timeZoneRouter } from './timeZoneRouter'

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = router({
    me: meRouter.me,
    signOut: signOutRouter.signOut,
    logger: loggerRouter,
    event: eventRouter,
    timeZone: timeZoneRouter,
    i18n: i18nRouter
})

export type AppRouter = typeof appRouter
