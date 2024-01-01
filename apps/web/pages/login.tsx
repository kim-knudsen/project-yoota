import { Button, Card, Divider, Grid, Input, Page, Spacer, Text, useToasts } from '@geist-ui/core'
import { Key, Mail, Search } from '@geist-ui/icons'
import { signIn, SignInOptions } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'
import { getVercelBaseUrl } from '../utils/getVercelBaseUrl'
import { logger } from '../utils/logger'

const log = logger('Login')

export default function Login() {
    const router = useRouter()
    const { setToast } = useToasts()
    const [emailLoading, setEmailLoading] = useState(false)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const baseUrl = getVercelBaseUrl()
    const { platform, redirect_uri } = router.query

    const signInOptions: SignInOptions = useMemo(
        () =>
            platform === 'mobile' && typeof redirect_uri === 'string'
                ? {
                      callbackUrl: `${baseUrl}/api/mobile-auth-callback?redirect_uri=${redirect_uri}`
                  }
                : { callbackUrl: `${baseUrl}/dashboard` },
        [baseUrl, platform, redirect_uri]
    )

    return (
        <>
            <Head>
                <title>Yoota. Login</title>
            </Head>
            <Page dotBackdrop width="800px" padding={0}>
                <Grid.Container justify="center" gap={3} mt="25px">
                    <Card shadow>
                        <Text h2>Login</Text>
                        <Spacer h={1.0} />
                        <Text span>Sign in with Google</Text>
                        <Spacer h={1.0} />
                        <Button icon={<Search />} onClick={() => signIn('google', signInOptions)}>
                            Google
                        </Button>
                        <Spacer h={1.0} />
                        <Divider />
                        <Spacer h={1.0} />
                        <Text span>Sign in with your email</Text>
                        <Spacer h={1.0} />
                        <Input placeholder="Email" ref={emailInputRef} disabled={emailLoading} />
                        <Spacer h={1.0} />
                        <Button
                            icon={<Mail />}
                            loading={emailLoading}
                            onClick={async () => {
                                try {
                                    const email = emailInputRef.current?.value
                                    if (email) {
                                        setEmailLoading(true)

                                        const response = await signIn('email', {
                                            ...signInOptions,
                                            email,
                                            // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
                                            redirect: false
                                        })

                                        log.debug(response)

                                        if (response?.error) {
                                            log.error(response.error)
                                            setToast({
                                                text: 'Oh no, an error occurred - you might wanna try again',
                                                type: 'error',
                                                delay: 3000
                                            })
                                        } else {
                                            setToast({
                                                text: `All good, head for your ${email} inbox`,
                                                type: 'success',
                                                delay: 3000
                                            })
                                        }
                                    }
                                } catch (error) {
                                    log.error(error)
                                } finally {
                                    setEmailLoading(false)
                                    if (emailInputRef.current) emailInputRef.current.value = ''
                                }
                            }}
                        >
                            Email
                        </Button>
                        <Spacer h={1.0} />
                        <Divider />
                        <Spacer h={1.0} />
                        <Text span>Sign in with Fake OAuth</Text>
                        <Spacer h={1.0} />
                        <Button icon={<Key />} onClick={() => signIn('fake-oauth', signInOptions)}>
                            Fake OAuth
                        </Button>
                    </Card>
                </Grid.Container>
            </Page>
        </>
    )
}
