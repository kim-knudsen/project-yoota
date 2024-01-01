import { IntlProvider } from '@yoota/i18n'
import React, { FunctionComponent, PropsWithChildren } from 'react'
import { getLocales } from 'react-native-localize'
import { useUserLocale } from '../hooks/localeHooks'
import { logger } from '../utils/logger'
import { trpc } from '../utils/trpc'

interface Props extends PropsWithChildren {}

const log = logger('BootProvider')

/**
 * Currently only wrapping the `I18nProvider`, as the naming implies, this could be used for fetching initial/critia
 * data, e.g. "kill switch", config/feature flags etc.
 */
export const BootProvider: FunctionComponent<Props> = ({ children }) => <I18nProvider>{children}</I18nProvider>

export const I18nProvider: FunctionComponent<Props> = ({ children }) => {
    const { data: userLocale, isFetching } = useUserLocale()
    const deviceLocales = getLocales().map(({ languageTag }) => languageTag)
    const preferredLocales = userLocale ? [userLocale, ...deviceLocales] : deviceLocales

    log.debug({ deviceLocales, userLocale, preferredLocales })

    const { data } = trpc.i18n.translations.useQuery({ locales: preferredLocales }, { enabled: !isFetching })

    // TODO: Error handling
    // TODO: Show loading indicator or keep the splash screen alive until the "booting" is done?
    if (!data) return null

    const { defaultLocale, locale, messages } = data

    return (
        <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
            {children}
        </IntlProvider>
    )
}
