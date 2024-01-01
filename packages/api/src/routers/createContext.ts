import * as trpc from '@trpc/server'
import { getSessionFromRequest } from '@yoota/auth'
import { prisma } from '@yoota/db'
import { IncomingMessage, ServerResponse } from 'http'

interface ContextOptions {
    req: IncomingMessage & {
        cookies: Partial<{
            [key: string]: string
        }>
    }
    res: ServerResponse
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req, res }: ContextOptions) => {
    const session = await getSessionFromRequest(req, res)

    // for API-response caching see https://trpc.io/docs/caching
    return {
        req,
        res,
        prisma,
        session
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
