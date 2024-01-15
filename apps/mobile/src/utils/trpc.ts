import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@yoota/api'

export const trpc = createTRPCReact<AppRouter>()
