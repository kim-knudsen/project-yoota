import { useMutation } from '@tanstack/react-query'
import { LocaleOrLanguage, useIntl } from '@yoota/i18n'
import { URL_SCHEME } from '../data/constants'
import { BASE_URL } from '../data/env'

type CsrfToken = string

interface CsrfTokenResponse {
    csrfToken: CsrfToken
}

export const useEmailLoginProvider = () => {
    const { locale } = useIntl()
    return useMutation({
        mutationFn: async (email: string) => {
            const { csrfToken } = await getCsrfToken()
            return postMailRequest({ csrfToken, email, locale: locale as LocaleOrLanguage })
        }
    })
}

const getCsrfToken = async () => {
    const url = `${BASE_URL}/api/auth/csrf`
    const rawResponse = await fetch(url, {
        method: 'GET'
    })

    const content = await rawResponse.json()
    return content as CsrfTokenResponse
}

const postMailRequest = async ({
    csrfToken,
    email,
    locale
}: {
    email: string
    csrfToken: CsrfToken
    locale: LocaleOrLanguage
}) => {
    const url = `${BASE_URL}/api/auth/signin/email?locale=${locale}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            json: true,
            callbackUrl: URL_SCHEME,
            csrfToken
        })
    })

    return response
}
