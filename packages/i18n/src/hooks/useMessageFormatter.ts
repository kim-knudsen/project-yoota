import { useCallback } from 'react'
import { IntlShape, MessageDescriptor, useIntl } from 'react-intl'
import type { RootMessageKey } from '../common'
import type { Messages } from '../lang'

type FormatMessageParameters = Parameters<IntlShape['formatMessage']>
type Values = FormatMessageParameters[1]

export const useMessageFormatter = <TKey extends RootMessageKey>(categoty: TKey) => {
    const { formatMessage } = useIntl()

    return useCallback(
        (messageKey: keyof Messages[TKey], values?: Values) => {
            const messageDescriptor: MessageDescriptor = {
                id: `${categoty}.${messageKey.toString()}`
            }
            return formatMessage(messageDescriptor, values)
        },
        [formatMessage]
    )
}
