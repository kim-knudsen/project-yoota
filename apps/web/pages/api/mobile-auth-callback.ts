import {
    createSignedToken,
    CSRF_TOKEN_KEY,
    getAuthTokensFromCookies,
    SESSION_TOKEN_KEY,
    SESSION_TOKEN_KEY_PROD
} from '@yoota/auth'
import { createConsoleLogger } from '@yoota/logger'

import { NextApiHandler } from 'next'

const logger = createConsoleLogger('mobile-auth-callback')

const apiHandler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        return res.status(400).end()
    }

    const { cookies } = req
    const { query } = req

    logger.debug({ cookies, query })

    const { csrfToken, sessionToken } = getAuthTokensFromCookies(cookies)

    if (csrfToken && sessionToken && typeof query['redirect_uri'] === 'string') {
        const redirectUri = new URL(query.redirect_uri)
        try {
            logger.debug('createSignedToken')
            const token = createSignedToken({
                [CSRF_TOKEN_KEY]: csrfToken,
                [SESSION_TOKEN_KEY]: sessionToken
            })

            redirectUri.searchParams.set('accessToken', token)
            logger.debug('Starting redirect to', redirectUri.toString())

            // Make sure to clean up any next-auth session cookies to prevent the user from staying
            // logged in within the mobile Browser - Android Chrome issue. On iOS the in-app browser opens
            // an "incognito" browser window, i.e. the session dies when closing the browser.
            const deletedCookieValue = '=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

            res.setHeader('Set-Cookie', [
                `${SESSION_TOKEN_KEY}${deletedCookieValue}`,
                `${SESSION_TOKEN_KEY_PROD}${deletedCookieValue}`
            ])

            return res.status(302).setHeader('Location', redirectUri.toString()).end()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while signing the token'
            logger.error(errorMessage)
            redirectUri.searchParams.set('error', errorMessage)

            return res.status(302).setHeader('Location', redirectUri.toString()).end()
        }
    }

    res.status(400).json({ error: 'Invalid cookie values' })
}

export default apiHandler
