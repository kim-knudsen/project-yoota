import { NextApiRequest } from 'next'
import { CSRF_TOKEN_KEY, CSRF_TOKEN_KEY_PROD, SESSION_TOKEN_KEY, SESSION_TOKEN_KEY_PROD } from '../data/constants'

export const getAuthTokensFromCookies = (cookies: NextApiRequest['cookies']) => {
    const csrfToken = cookies[CSRF_TOKEN_KEY] ?? cookies[CSRF_TOKEN_KEY_PROD]
    const sessionToken = cookies[SESSION_TOKEN_KEY] ?? cookies[SESSION_TOKEN_KEY_PROD]

    return {
        csrfToken,
        sessionToken
    }
}
