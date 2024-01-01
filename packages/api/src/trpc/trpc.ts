import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { loggerMiddleware } from '../middleware/loggerMiddleware'
import { Context } from '../routers/createContext'

export type MiddlewareFunction = Parameters<typeof middleware>['0']

const t = initTRPC.context<Context>().create({
    transformer: superjson
})

export const router = t.router
export const middleware = t.middleware
export const baseProcedure = t.procedure.use(middleware(loggerMiddleware))
