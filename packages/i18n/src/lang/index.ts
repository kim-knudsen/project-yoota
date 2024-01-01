import { Locale, LocalesAndLanguages } from '../common'
import da from './da'
import enUS from './en-US'

export const DEFAULT_LOCALE: Locale = 'en-US'

export const translatedMessages = {
    da,
    [DEFAULT_LOCALE]: enUS
}

export const supportedLocales = Object.keys(translatedMessages) as LocalesAndLanguages

export type Messages = typeof da
