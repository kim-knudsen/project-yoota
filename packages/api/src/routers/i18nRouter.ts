import {
    DEFAULT_LOCALE,
    getLocaleFromPreferredLocales,
    getMessagesForLocale,
    LocalesAndLanguages,
    parseAcceptLanguage
} from '@yoota/i18n'
import { IncomingMessage } from 'http'
import { z } from 'zod'
import { baseProcedure, router } from '../trpc/trpc'

const Locales = z.array(z.string())

export const i18nRouter = router({
    translations: baseProcedure
        .input(z.object({ locales: Locales }).optional())
        .query(async ({ ctx: { req }, input }) => {
            const inputLocale = input?.locales ?? []
            const headerLocales = localesFromRequestHeader(req)
            const preferredLocales = [...inputLocale, ...headerLocales] as LocalesAndLanguages
            const locale = getLocaleFromPreferredLocales(preferredLocales)

            return {
                defaultLocale: DEFAULT_LOCALE,
                locale,
                messages: getMessagesForLocale(locale)
            }
        })
})

const localesFromRequestHeader = (req: IncomingMessage) => {
    const acceptLanguageHeader = req.headers['accept-language']
    return acceptLanguageHeader ? parseAcceptLanguage(acceptLanguageHeader) : []
}
