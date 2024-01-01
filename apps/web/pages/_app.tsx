import { CssBaseline, GeistProvider } from '@geist-ui/core'
import { CookieProvider } from '@reactivers/use-cookie'
import { LocaleOrLanguage } from '@yoota/i18n'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { I18nProvider } from '../providers/I18nProvider'
import '../styles/globals.css'
import { trpc } from '../utils/trpc'

type Props = AppProps<{ session?: Session | null; locale: LocaleOrLanguage }>

const YootaApp = ({ Component, pageProps: { session, locale, ...pageProps } }: Props) => (
    <SessionProvider session={session}>
        <GeistProvider>
            <CssBaseline />
            <CookieProvider>
                <I18nProvider locale={locale}>
                    <Component {...pageProps} />
                </I18nProvider>
            </CookieProvider>
        </GeistProvider>
    </SessionProvider>
)

export default trpc.withTRPC(YootaApp)
