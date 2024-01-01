import { DEFAULT_LOCALE, supportedLocales } from '.'
import { getMessagesForLocale } from '../common'

describe('all languages should share the same keys as the default', () => {
    const messages = getMessagesForLocale(DEFAULT_LOCALE)
    const defaultKeys = new Set(Object.keys(messages))

    supportedLocales.forEach(locale => {
        if (locale !== DEFAULT_LOCALE) {
            test(`"${locale}" should have the same keys as "${DEFAULT_LOCALE}"`, () => {
                const keys = new Set(Object.keys(getMessagesForLocale(locale)))
                expect(eqSet(defaultKeys, keys)).toEqual(true)
            })
        }
    })
})

const eqSet = <T>(a: Set<T>, b: Set<T>) => a.size === b.size && [...a].every(x => b.has(x))
