import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIntl, useTranslations } from '@yoota/i18n'
import React, { FC, useCallback } from 'react'
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { SafeAreaView } from 'react-native-safe-area-context'
import { URL } from 'react-native-url-polyfill'
import { storeAccessToken } from '../../auth/auth'
import { URL_SCHEME } from '../../data/constants'
import { BASE_URL, getLaunchArguments } from '../../data/env'
import { useEmailLoginProvider } from '../../hooks/useEmailLoginProvider'
import { logger } from '../../utils/logger'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>
type BrowserLoginType = 'google' | 'fake-oauth'

const log = logger('LoginScreen')

const LoginScreen: FC<Props> = ({ navigation }) => {
    const { locale } = useIntl()
    const { invalidate } = trpc.useContext()

    const loginHandler = useCallback(
        async (type: BrowserLoginType) => {
            try {
                const authUrl = getAuthUrl(type, locale)

                log.debug('Opening browser', { url: authUrl, type })

                const result = await InAppBrowser.openAuth(authUrl, URL_SCHEME, {
                    hasBackButton: false,
                    // iOS Properties
                    ephemeralWebSession: true,
                    // Android Properties
                    enableUrlBarHiding: false,
                    enableDefaultShare: false,
                    forceCloseOnRedirection: false,
                    showInRecents: true
                })

                if (result.type === 'success') {
                    log.debug('success', result)

                    const url = new URL(result.url)
                    const accessToken = url.searchParams.get('accessToken')

                    log.debug('token', { url, accessToken })

                    if (accessToken) {
                        await storeAccessToken(accessToken)
                        await invalidate()
                        navigation.navigate('Home')
                    }
                } else {
                    log.error('error', result.type)
                }
            } finally {
                InAppBrowser.closeAuth()
            }
        },
        [invalidate, locale, navigation]
    )

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 20 }}>
                <TouchableOpacity
                    onPress={() => loginHandler('google')}
                    activeOpacity={0.5}
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        backgroundColor: 'white'
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Google</Text>
                </TouchableOpacity>
                <Divider />
                <EmailLoginButton />
                <Divider />
                <TouchableOpacity
                    testID="fakeOauthButton"
                    onPress={() => loginHandler('fake-oauth')}
                    activeOpacity={0.5}
                    style={{
                        paddingVertical: 30,
                        paddingHorizontal: 20,
                        borderRadius: 12,
                        backgroundColor: 'white'
                    }}
                >
                    <Text style={{ fontSize: 16 }}>Fake OAuth</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const getAuthUrl = (type: BrowserLoginType, locale: string) => {
    const url = new URL(`${BASE_URL}/login/provider`)

    url.searchParams.append('redirect_uri', encodeURIComponent(URL_SCHEME))
    url.searchParams.append('type', type)
    url.searchParams.append('locale', locale)

    const { mockUser } = getLaunchArguments()

    if (mockUser) {
        log.info(`Using mocked user`, mockUser)
        url.searchParams.append('authorization_params', encodeURIComponent(`user=${mockUser}`))
    }

    return url.href
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: 16,
        backgroundColor: 'white',
        marginVertical: 4,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 12
    }
})

const Divider = () => (
    <View
        style={{
            width: '100%',
            borderBottomColor: '#BBBBBB',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 20,
            marginBottom: 20
        }}
    />
)

const EmailLoginButton: FC = () => {
    const { emailLoginButtonLabel, emailPlaceholder } = useTranslations('login')
    const { mutateAsync: postMailRequest } = useEmailLoginProvider()
    const [email, setEmail] = React.useState('')

    const emailLoginHandler = useCallback(async () => {
        try {
            const result = await postMailRequest(email)
            setEmail('')
            log.debug('emailLoginHandler', result)
        } catch (error) {
            log.error(error)
        }
    }, [email, postMailRequest])

    return (
        <>
            <TextInput placeholder={emailPlaceholder} value={email} onChangeText={setEmail} style={styles.textInput} />
            <Button title={emailLoginButtonLabel} onPress={emailLoginHandler} disabled={email.length === 0} />
        </>
    )
}

export default LoginScreen
