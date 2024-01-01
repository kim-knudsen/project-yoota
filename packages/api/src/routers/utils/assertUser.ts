import { TRPCError } from '@trpc/server'
import { Session } from 'next-auth'
interface SessionWithUser extends Session {
    user: {
        name: string
        email: string
        image: string | null
    }
    token: string
    userId: string
}

export function assertUser(session: Session | null): asserts session is NonNullable<SessionWithUser> {
    if (!session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
}
