import { IntlProvider, LocaleOrLanguage } from '@yoota/i18n'
import { FunctionComponent, PropsWithChildren } from 'react'
import { useLocaleCookie } from '../hooks/useLocaleCookie'
import { logger } from '../utils/logger'
import { trpc } from '../utils/trpc'

interface Props extends PropsWithChildren {
    locale?: LocaleOrLanguage
}

const log = logger('I18nProvider')

export const I18nProvider: FunctionComponent<Props> = ({ locale: localeFromProps, children }) => {
    log.debug({ localeFromProps })

    const enabled = !!localeFromProps

    const { locale: cookieLocale } = useLocaleCookie()
    const { data } = trpc.i18n.translations.useQuery({ locales: [cookieLocale ?? localeFromProps] }, { enabled })

    if (!enabled) return <>{children}</>

    // TODO: Loading indicator?
    if (!data) return null

    const { defaultLocale, locale, messages } = data

    return (
        <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
            {children}
        </IntlProvider>
    )
}
