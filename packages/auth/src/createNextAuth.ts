import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { assertTruthy } from '@yoota/common'
import { prisma } from '@yoota/db'
import { LocaleOrLanguage } from '@yoota/i18n'
import { createConsoleLogger } from '@yoota/logger'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { Adapter } from 'next-auth/adapters'
import { Provider } from 'next-auth/providers'
import GoogleProvider from 'next-auth/providers/google'
import { FakeOauthProvider } from './providers/FakeOauthProvider'
import { createEmailProvider } from './util/createEmailProvider'

interface CustomAuthOptions {
    locale: LocaleOrLanguage
}

const { EMAIL_SERVER, EMAIL_FROM, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

const log = createConsoleLogger({ name: 'createNextAuth', level: 'debug' })

const getProviders = ({ locale }: CustomAuthOptions) => {
    assertTruthy(EMAIL_SERVER && EMAIL_FROM, 'Expected EMAIL_SERVER and EMAIL_FROM to be defined')
    assertTruthy(
        GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET,
        'Expected GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be defined'
    )

    const providers: Provider[] = [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        }),
        createEmailProvider(locale)
    ]

    // TODO: Only use our fake OAuth provider for non prod environments
    // if (getVercelEnvironment() !== VercelEnvironment.PRODUCTION) {
    providers.push(FakeOauthProvider())
    // }

    return providers
}

const getPrismaAdapter = (): Adapter => {
    const adapter = PrismaAdapter(prisma)

    // HACK to circumvent issue when user log in using the email provider when already registered.
    // https://github.com/nextauthjs/next-auth/issues/4495
    const safelyDeleteSession = async (sessionToken: string) => {
        try {
            const deleteResult = await prisma.session.delete({ where: { sessionToken } })
            return deleteResult
        } catch (e) {
            console.error('Failed to delete session', e)
            return null
        }
    }

    adapter.deleteSession = safelyDeleteSession

    return adapter
}

// See https://next-auth.js.org/configuration/options
export const createAuthOptions = (options: CustomAuthOptions) =>
    ({
        // Configure one or more authentication providers
        adapter: getPrismaAdapter(),
        providers: getProviders(options),
        // https://next-auth.js.org/configuration/options#session
        session: {
            maxAge: 365 * 24 * 60 * 60, // 1 year in seconds,
            updateAge: 48 * 60 * 60 // 48 hours in seconds
        },
        callbacks: {
            async session({ session, user }) {
                return { ...session, userId: user.id }
            }
        },
        events: {
            async createUser({ user }) {
                log.info('User created', user)
                // Ensure user name (e.g. not provided via email provider)
                if (!user.name && user.email) {
                    try {
                        const [name] = user.email.split('@')
                        await prisma.user.update({ where: { id: user.id }, data: { name } })
                    } catch (error) {
                        log.error('Error setting user name', error)
                    }
                }
            }
        }
    } as NextAuthOptions)

export const createNextAuth = (options: CustomAuthOptions) => NextAuth(createAuthOptions(options))
