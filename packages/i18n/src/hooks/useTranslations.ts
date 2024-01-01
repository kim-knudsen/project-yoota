import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import type { RootMessageKey } from '../common'
import type { Messages } from '../lang'

export const useTranslations = <TKey extends RootMessageKey>(category: TKey) => {
    const { messages } = useIntl()

    return useMemo(() => {
        const keys = Object.keys(messages).filter(key => key.startsWith(`${category}.`))
        const translations = keys.reduce((result, key) => {
            const subKey = key.replace(`${category}.`, '')
            return { ...result, [subKey]: messages[key] }
        }, {})
        return translations as Messages[TKey]
    }, [messages, category])
}
