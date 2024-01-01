import { QueryClientConfig } from '@tanstack/react-query'
import { httpBatchLink, TRPCClientError } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { AppRouter } from '@yoota/api'
import superjson from 'superjson'
import { getVercelBaseUrl } from './getVercelBaseUrl'

const queryClientConfig: QueryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 300000, // 5 min
            retry: (failureCount: number, error: unknown) => {
                // TODO: Don't we have a better way identifying TRPC errors?
                if (error instanceof TRPCClientError && error.data && typeof error.data.httpStatus === 'number') {
                    // Don't retry unauthorized requests
                    return error.data.httpStatus !== 401
                }

                return failureCount < 3
            }
        }
    }
}

export const trpc = createTRPCNext<AppRouter>({
    config({ ctx }) {
        return {
            links: [
                httpBatchLink({
                    /**
                     * If you want to use SSR, you need to use the server's full URL
                     * @link https://trpc.io/docs/ssr
                     **/
                    url: `${getVercelBaseUrl()}/api/trpc`
                })
            ],
            /**
             * @link https://tanstack.com/query/v4/docs/reference/QueryClient
             **/
            queryClientConfig,
            transformer: superjson
        }
    },
    /**
     * @link https://trpc.io/docs/ssr
     **/
    ssr: false
})
