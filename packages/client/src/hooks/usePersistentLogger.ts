import { createTRPCNext } from '@trpc/next'
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@yoota/api'
import { useCallback, useMemo } from 'react'
import { AnalyticsEvent } from '../analytics/analyticsEvent'

type Trpc = ReturnType<typeof createTRPCReact<AppRouter>> | ReturnType<typeof createTRPCNext<AppRouter>>

export const usePersistentLogger = (trpc: Trpc) => {
    const { mutateAsync: captureInfo } = trpc.logger.info.useMutation()
    const { mutateAsync: mutateAsyncAnalytics } = trpc.logger.analytics.useMutation()
    const { mutateAsync: captureError } = trpc.logger.error.useMutation()

    const captureAnalytics = useCallback(
        (input: { name: string; event: AnalyticsEvent }) =>
            mutateAsyncAnalytics({ name: input.name, payload: input.event }),
        [mutateAsyncAnalytics]
    )

    return useMemo(
        () => ({
            captureInfo,
            captureAnalytics,
            captureError
        }),
        [captureInfo, captureAnalytics, captureError]
    )
}
