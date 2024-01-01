import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { URL } from 'react-native-url-polyfill'
import WebView, { WebViewNavigation } from 'react-native-webview'
import { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes'
import { storeAccessToken } from '../../auth/auth'
import { URL_SCHEME } from '../../data/constants'
import { BASE_URL } from '../../data/env'
import { logger } from '../../utils/logger'
import { trpc } from '../../utils/trpc'
import { MAGIC_LINK_SCREEN_PATH, RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'MagicLink'>

interface VerifierProps {
    verificationToken: string
    email: string
}

interface AccessTokenHandlerProps {
    accessToken: string
    navigation: Props['navigation']
}

const log = logger('MagicLinkScreen')

/**
 * The `MagicLinkScreen` handles login via a "magic link", e.g. `yooha://login/email?verificationToken=123&email=foo@bar.com`.
 *
 * There are 2 parts to this flow - each flow handled by a dedicated component. First the verification, handled
 * within a web view (NextAuth). On successful verification, a redirect back to the same `MagicLinkScreen` occurs, this
 * time including the `accessToken`. The `AccessTokenHandler` component will save the token value and navigate the user "home".
 */
const MagicLinkScreen: FC<Props> = ({ route, navigation }) => {
    log.debug(route.params)

    const { params } = route
    const isVerification = 'verificationToken' in params

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, color: 'grey' }}>Logging in...</Text>
            {isVerification ? (
                <Verifier {...params} />
            ) : (
                <AccessTokenHandler accessToken={params.accessToken} navigation={navigation} />
            )}
        </SafeAreaView>
    )
}

const Verifier: FC<VerifierProps> = ({ email, verificationToken }) => {
    const uri = useMemo(() => constructUrl(verificationToken, email), [verificationToken, email])

    const onNavigationStateChange = useCallback(async (event: WebViewNavigation) => {
        log.debug('onNavigationStateChange', event)

        const url = new URL(event.url)
        const error = url.searchParams.get('error')

        if (error) {
            // TODO: Handle verification error
            log.error('Error handling verification', error)
        }
    }, [])

    const onErrorHandler = useCallback((event: WebViewErrorEvent) => {
        log.error('onErrorHandler', event)
    }, [])

    return (
        <WebView
            source={{ uri }}
            onNavigationStateChange={onNavigationStateChange}
            onError={onErrorHandler}
            style={{ display: 'none' }}
        />
    )
}

const AccessTokenHandler: FC<AccessTokenHandlerProps> = ({ accessToken, navigation }) => {
    log.debug('AccessTokenHandler', accessToken)

    const { invalidate } = trpc.useContext()
    const handler = useCallback(async () => {
        if (accessToken) {
            await storeAccessToken(accessToken)
            await invalidate()
            navigation.navigate('Home')
        }
    }, [accessToken, invalidate, navigation])

    useEffect(() => {
        handler()
    }, [handler])

    return null
}

const constructUrl = (verificationToken: string, email: string) => {
    const redirectUrl = encodeURIComponent(`${URL_SCHEME}${MAGIC_LINK_SCREEN_PATH}`)
    const callbackUrl = encodeURIComponent(`/api/mobile-auth-callback?redirect_uri=${redirectUrl}`)
    return `${BASE_URL}/api/auth/callback/email?callbackUrl=${callbackUrl}&token=${verificationToken}&email=${encodeURIComponent(
        email
    )}`
}

export default MagicLinkScreen
