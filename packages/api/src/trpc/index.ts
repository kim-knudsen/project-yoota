// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../routers'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export type { AppRouter }
