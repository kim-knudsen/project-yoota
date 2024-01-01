import { createPersistentLogger } from '../logger/createPersistentLogger'
import type { MiddlewareFunction } from '../trpc/trpc'

const logger = createPersistentLogger('trpcLoggerMiddleware')

export const loggerMiddleware: MiddlewareFunction = async ({ path, type, next }) => {
    const start = Date.now()
    const result = await next()
    const duration = Date.now() - start
    result.ok
        ? logger.info({ success: true, path, type, duration })
        : logger.warn({ success: false, path, type, duration })

    return result
}
