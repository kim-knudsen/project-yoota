import { LocalesAndLanguages, parseAcceptLanguage } from '@yoota/i18n'
import { parse as parseCookie } from 'cookie'
import { IncomingMessage } from 'http'
import { GetServerSideProps } from 'next'

import { parse as parseUrl } from 'url'
import { getSSGHelpers } from './getSSGHelpers'
import { logger } from './logger'

const log = logger('localeUtils')

export const getPreferredLocales = (req: IncomingMessage) => {
    const { locale: localeQueryValue } = parseUrl(req.url ?? '', true).query
    const localeQuery = localeQueryValue ? [localeQueryValue.toString()] : []
    const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {}
    const localeCookie = 'locale' in cookies ? [cookies['locale']] : []
    const acceptLanguageHeader = req.headers['accept-language']

    log.debug({ localeCookie, acceptLanguageHeader, localeQuery })

    const headerLocales = acceptLanguageHeader ? parseAcceptLanguage(acceptLanguageHeader) : []
    // In preferred order. Any `locale` from the query string will be first in line
    return [...localeQuery, ...localeCookie, ...headerLocales] as LocalesAndLanguages
}

export const getServerSidePropsWithLocales: GetServerSideProps = async ({ req, res }) => {
    try {
        const { ssg, locale } = await getSSGHelpers(req, res)

        return {
            props: {
                locale,
                trpcState: ssg.dehydrate()
            }
        }
    } catch {
        return {
            props: {}
        }
    }
}
