import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink, TRPCClientError } from '@trpc/client'
import React, { FunctionComponent, PropsWithChildren, useState } from 'react'
import superjson from 'superjson'
import { getAccessToken } from '../auth/auth'
import { BASE_URL } from '../data/env'
import { logger } from '../utils/logger'
import { trpc } from '../utils/trpc'

const log = logger('trpc')

const createTrpcClient = () =>
    trpc.createClient({
        // Order matters, `httpBatchLink` should be last...
        links: [
            loggerLink({
                logger: options => {
                    // TODO: Consider if we should log `elapsedMs` to the db to get an idea of the actual query/mutation
                    // time from the end user's perspective
                    log.debug(options)
                }
            }),
            httpBatchLink({
                url: `${BASE_URL}/api/trpc`,

                async headers() {
                    const token = await getAccessToken()
                    return token ? { Authorization: `Bearer ${token}` } : {}
                }
            })
        ],
        transformer: superjson
    })

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount: number, error: unknown) => {
                    // TODO: Don't we have a better way identifying TRPC errors?
                    if (error instanceof TRPCClientError && typeof error.data?.httpStatus === 'number') {
                        // Don't retry unauthorized requests
                        return error.data.httpStatus !== 401
                    }

                    return failureCount < 3
                }
            }
        }
    })

// https://trpc.io/docs/react#3-add-trpc-providers
const TrpcProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
    const [queryClient] = useState(createQueryClient)
    const [trpcClient] = useState(createTrpcClient)

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}

export default TrpcProvider
