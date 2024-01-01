import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { trpc } from '../utils/trpc'
import { clearAccessToken } from './auth'

export const useSignOut = () => {
    const queryClient = useQueryClient()
    const { mutateAsync: signOut } = trpc.signOut.useMutation()

    return useCallback(async () => {
        try {
            await signOut()
            await clearAccessToken()
        } finally {
            // HACK: resetQueries not yet exposed via trpc, see https://github.com/trpc/trpc/issues/3012
            queryClient.resetQueries([['me']])
        }
    }, [queryClient, signOut])
}
