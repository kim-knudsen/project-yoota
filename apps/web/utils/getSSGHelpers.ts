import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { Context } from '@yoota/api'
import { appRouter } from '@yoota/api'
import { getSessionFromRequest } from '@yoota/auth'
import { prisma } from '@yoota/db'
import { getLocaleFromPreferredLocales, LocaleOrLanguage } from '@yoota/i18n'
import superjson from 'superjson'
import { getPreferredLocales } from './localeUtils'

export const getSSGHelpers = async (req: Context['req'], res: Context['res'], fetchLocale = true) => {
    const session = await getSessionFromRequest(req, res)

    const ssg = createProxySSGHelpers({
        router: appRouter,
        ctx: {
            prisma,
            session,
            req,
            res
        },
        transformer: superjson
    })

    let locale: LocaleOrLanguage | null = null

    if (fetchLocale) {
        const locales = getPreferredLocales(req)

        locale = getLocaleFromPreferredLocales(locales)

        res.setHeader('Set-Cookie', `locale=${locale}`)

        await ssg.i18n.translations.fetch({ locales: [locale] })
    }

    return {
        ssg,
        locale
    }
}
