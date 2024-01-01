import { DEFAULT_LOCALE } from '@yoota/i18n'
import { createConsoleLogger } from '@yoota/logger'
import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { createAuthOptions } from '../createNextAuth'
import { CSRF_TOKEN_KEY, CSRF_TOKEN_KEY_PROD, SESSION_TOKEN_KEY, SESSION_TOKEN_KEY_PROD } from '../data/constants'
import { verifySignedToken } from './jwt'

const logger = createConsoleLogger('getSessionFromRequest')

export const getSessionFromRequest = async (
    req: GetServerSidePropsContext['req'],
    res: GetServerSidePropsContext['res']
) => {
    const { cookies } = req
    const authHeader = req.headers['authorization']
    // Locale shouldnt matter getting the session - so we just provide the default
    const authOptions = createAuthOptions({ locale: DEFAULT_LOCALE })

    // The app/mobile uses bearer authentication, but NextAuth only works with cookies, so a hack is needed below...
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        logger.debug('Bearer authentication detected')

        const token = authHeader.substring(7, authHeader.length)
        const payload = verifySignedToken(token)

        if (typeof payload !== 'string' && CSRF_TOKEN_KEY in payload && SESSION_TOKEN_KEY in payload) {
            const csrfToken = payload[CSRF_TOKEN_KEY]
            const sessionToken = payload[SESSION_TOKEN_KEY]

            // Construct "fake" cookie to satisfy getServerSession in order to obtain session
            const cookiePart = {
                [CSRF_TOKEN_KEY]: csrfToken,
                [CSRF_TOKEN_KEY_PROD]: csrfToken,
                [SESSION_TOKEN_KEY]: sessionToken,
                [SESSION_TOKEN_KEY_PROD]: sessionToken
            }

            req.cookies = { ...cookies, ...cookiePart }

            const session = await getServerSession(req, res, authOptions)

            res.removeHeader('Set-Cookie')

            if (!session) {
                logger.warn('Unable to obtain session', { payload })
                return null
            }

            return {
                ...session,
                token: payload[SESSION_TOKEN_KEY]
            }
        }
    }

    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.removeHeader('Set-Cookie')
        return null
    }

    const token = cookies[SESSION_TOKEN_KEY] ?? cookies[SESSION_TOKEN_KEY_PROD]

    return {
        ...session,
        token
    }
}
