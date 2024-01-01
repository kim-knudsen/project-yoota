// See https://vercel.com/docs/concepts/projects/environment-variables

import { assertIsDefined, isRunningOnVercel, NEXT_PUBLIC_VERCEL_URL } from '@yoota/common'

export const getVercelBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return ''
    }
    if (isRunningOnVercel()) {
        assertIsDefined(NEXT_PUBLIC_VERCEL_URL, 'Expected "NEXT_PUBLIC_VERCEL_URL" to be defined')
        return `https://${NEXT_PUBLIC_VERCEL_URL}`
    }

    return 'http://localhost:3000'
}
