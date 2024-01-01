import { DEFAULT_LOCALE } from '@yoota/i18n'
import { createMockedContext } from '../test/createMockedContext'
import { i18nRouter } from './i18nRouter'

describe('get expected locales', () => {
    const context = createMockedContext()
    const caller = i18nRouter.createCaller(context)

    test('should get default locale', async () => {
        const { locale: a } = await caller.translations()
        expect(a).toEqual(DEFAULT_LOCALE)

        const { locale: b } = await caller.translations({ locales: ['xx-XX'] })
        expect(b).toEqual(DEFAULT_LOCALE)
    })

    test('should get preferred locale', async () => {
        const { locale } = await caller.translations({ locales: ['da', 'en-US'] })
        expect(locale).toEqual('da')
    })

    test('should get preferred language', async () => {
        const { locale: a } = await caller.translations({ locales: ['ru-US', 'da-AU'] })
        expect(a).toEqual('da')

        const { locale: b } = await caller.translations({ locales: ['ru-US', 'en-DK', 'da-AU'] })
        expect(b.startsWith('en')).toEqual(true)
    })
})
