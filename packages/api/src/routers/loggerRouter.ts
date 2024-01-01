import { assertIsDefined } from '@yoota/common'
import crypto from 'crypto'
import { GetServerSidePropsContext } from 'next'
import { z } from 'zod'
import { createPersistentLogger } from '../logger/createPersistentLogger'
import { baseProcedure, router } from '../trpc/trpc'

export const loggerRouter = router({
    info: baseProcedure
        .input(z.object({ name: z.string(), payload: z.any() }))
        .mutation(async ({ input, ctx: { req } }) => {
            const info = extractRequestInfo(req)
            const logger = createPersistentLogger(input.name)

            await logger.info(input.payload, info)
        }),
    error: baseProcedure
        .input(z.object({ name: z.string(), error: z.any() }))
        .mutation(async ({ input, ctx: { req } }) => {
            const info = extractRequestInfo(req)
            const logger = createPersistentLogger(input.name)

            await logger.error(input.error, info)
        }),
    analytics: baseProcedure
        .input(z.object({ name: z.string(), payload: z.any() }))
        .mutation(async ({ input, ctx: { req } }) => {
            const info = extractRequestInfo(req)
            const logger = createPersistentLogger(input.name)

            await logger.analytics(input.payload, info)
        }),
    token: baseProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
        console.log(input.token)

        // eslint-disable-next-line turbo/no-undeclared-env-vars
        const secret = process.env.NEXTAUTH_SECRET

        assertIsDefined(secret, 'Expected NEXTAUTH_SECRET')

        return crypto.createHash('sha256').update(`${input.token}${secret}`).digest('hex')
    })
})

const extractRequestInfo = (req: GetServerSidePropsContext['req']) => {
    const ip = req.headers['x-forwarded-for']?.toString() ?? req.socket.remoteAddress ?? null
    const userAgent = req.headers['user-agent']?.toString()

    return {
        ip,
        userAgent
    }
}
