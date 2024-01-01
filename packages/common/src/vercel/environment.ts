// NOTE: Don't use destructuring (for WebPack), e.g.: const { NEXT_PUBLIC_VERCEL_ENV } = process.env
export const NEXT_PUBLIC_VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV
export const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL

export enum VercelEnvironment {
    PRODUCTION = 'production',
    PREVIEW = 'preview',
    DEVELOPMENT = 'development'
}

export const getVercelEnvironment = () => NEXT_PUBLIC_VERCEL_ENV as VercelEnvironment | undefined

export const isRunningOnVercel = () => !!getVercelEnvironment()
