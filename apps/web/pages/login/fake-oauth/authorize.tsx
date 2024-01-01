import { Button, Card, Grid, Page, Spacer, Text } from '@geist-ui/core'
import { assertTruthy } from '@yoota/common'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { getSSGHelpers } from '../../../utils/getSSGHelpers'

interface Props {
    redirectUri: string
    user: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res, query }) => {
    const { redirect_uri, state, user } = query

    assertTruthy(typeof redirect_uri === 'string', 'redirect_uri is required')
    assertTruthy(typeof state === 'string', 'state is required')
    assertTruthy(typeof user === 'string' || user === undefined, 'user must be a string or undefined')

    const { ssg, locale } = await getSSGHelpers(req, res)

    const url = new URL(redirect_uri)
    url.searchParams.set('state', state)

    return {
        props: {
            redirectUri: url.toString(),
            user: user || null,
            state,
            trpcState: ssg.dehydrate(),
            locale
        }
    }
}

export default function Authorize({ redirectUri, user }: Props) {
    const router = useRouter()

    const signInHandler = useCallback(
        (code: string) => {
            const url = new URL(redirectUri)
            url.searchParams.set('code', code)
            router.push(url.toString())
        },
        [redirectUri, router]
    )

    useEffect(() => {
        if (user) signInHandler(user)
    }, [user, signInHandler])

    return (
        <>
            <Head>
                <title>Yoota. Fake OAuth</title>
            </Head>
            <Page dotBackdrop width="800px" padding={0}>
                <Grid.Container justify="center" gap={3} mt="25px">
                    <Card shadow>
                        <Text h2>Fake OAuth Login</Text>
                        <Text span>Sign in with Fake OAuth</Text>
                        <Spacer h={1.0} />
                        <Button onClick={() => signInHandler('john')}>Sign in as John</Button>
                        <Spacer h={1.0} />
                        <Button onClick={() => signInHandler('jane')}>Sign in as Jane</Button>
                    </Card>
                </Grid.Container>
            </Page>
        </>
    )
}
