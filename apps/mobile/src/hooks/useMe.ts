import { trpc } from '../utils/trpc'

export const useMe = () => {
    const { data, error, isFetching, isLoading } = trpc.me.useQuery()
    const me = error || !data ? null : data

    return { me, isFetching, isLoading }
}
