import { useCookie } from '@reactivers/use-cookie'
import { LocaleOrLanguage } from '@yoota/i18n'
import { useCallback } from 'react'

export const useLocaleCookie = () => {
    const { cookie, setItem } = useCookie('locale')

    const setLocale = useCallback(
        (locale: LocaleOrLanguage) => {
            setItem({ value: locale, expireDays: 365 * 5 })
        },
        [setItem]
    )

    return {
        locale: cookie.locale as LocaleOrLanguage,
        setLocale
    }
}
