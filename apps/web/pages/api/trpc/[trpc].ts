/**
 * This file contains tRPC's HTTP response handler
 */
import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter, createContext, createPersistentLogger } from '@yoota/api'

const logger = createPersistentLogger('trpc')

export default createNextApiHandler({
    router: appRouter,
    /**
     * @link https://trpc.io/docs/context
     */
    createContext,
    /**
     * @link https://trpc.io/docs/error-handling
     */
    onError({ error }) {
        if (error.code === 'UNAUTHORIZED') return
        logger.error('onError', error)
    },
    /**
     * Enable query batching
     */
    batching: {
        enabled: true
    }
    /**
     * @link https://trpc.io/docs/caching#api-response-caching
     */
    // responseMeta() {
    //   // ...
    // },
})
