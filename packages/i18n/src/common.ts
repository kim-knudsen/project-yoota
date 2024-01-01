import { assertIsDefined } from '@yoota/common'
import { DEFAULT_LOCALE, Messages, supportedLocales, translatedMessages } from './lang'
export { parseAcceptLanguage } from 'intl-parse-accept-language'
export { IntlProvider } from 'react-intl'

/**
 * Type alias for a language identifier, e.g. `en`.
 */
export type Language = Lowercase<string>
/**
 * Type alias for a region identifier, e.g. `US`.
 */
export type Region = Capitalize<string>
/**
 * Type alias describing a locale, e.g. `en-US`.
 */
export type Locale = `${Language}-${Region}`
export type LocaleOrLanguage = Locale | Language
export type LocalesAndLanguages = ReadonlyArray<LocaleOrLanguage>

type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
    ? T[Key] extends Record<string, unknown>
        ? `${Key}.${FlattenObjectKeys<T[Key]>}`
        : `${Key}`
    : never

type FlatKeys = FlattenObjectKeys<Messages>
export type RootMessageKey = keyof Messages
type FlatMessageMap = Record<FlatKeys, string>

export type inferMessagesForCategory<TKey extends RootMessageKey> = Messages[TKey]

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace FormatjsIntl {
        interface Message {
            ids: FlatMessageMap
        }
    }
}

const getKeys = Object.keys as <T>(obj: T) => Array<keyof T>

export const getMessagesForLocale = (locale: LocaleOrLanguage) => {
    const messages = translatedMessages[locale]

    assertIsDefined(messages, `Unable to lookup messages for locale: ${locale}`)

    return Object.entries(messages).reduce((currentMap, messageEntry) => {
        const [messageKey, messageValue] = messageEntry

        const map = Object.entries(messageValue).reduce((object, messageValueEntry) => {
            const [key, value] = messageValueEntry
            return { ...object, [`${messageKey}.${key}`]: value }
        }, {})
        return { ...currentMap, ...map }
    }, {} as FlatMessageMap)
}

export const getMessagesForCategory = <TKey extends RootMessageKey>(locale: LocaleOrLanguage, category: TKey) => {
    const messages = getMessagesForLocale(locale)
    const keys = getKeys(messages).filter(key => key.startsWith(`${category}.`))
    const translations = keys.reduce((result, key) => {
        const subKey = key.replace(`${category}.`, '')
        return { ...result, [subKey]: messages[key] }
    }, {})

    return translations as Messages[TKey]
}

const getLanguage = (value: LocaleOrLanguage): Language => {
    const [language] = value.split('-')
    return language as Language
}

export const getLocaleFromPreferredLocales = (preferredLocales: LocalesAndLanguages) => {
    const exactMatch = preferredLocales.find(locale => supportedLocales.includes(locale))
    if (exactMatch) return exactMatch

    const preferredLanguages = preferredLocales.map(getLanguage)
    let locale: LocaleOrLanguage = DEFAULT_LOCALE

    for (const language of preferredLanguages) {
        const matchingLocale = supportedLocales.find(locale => locale.startsWith(language))
        if (matchingLocale) {
            locale = matchingLocale
            break
        }
    }

    return locale
}
