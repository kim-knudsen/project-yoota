import { Button, Card, Divider, Grid, Input, Link, Loading, Page, Select, Spacer, Text } from '@geist-ui/core'
import { PlusCircle, UserMinus } from '@geist-ui/icons'
import { Me, TimeZone } from '@yoota/client'
import { assertIsDefined } from '@yoota/common'
import { useMessageFormatter, useTranslations } from '@yoota/i18n'
import { signOut } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FunctionComponent, useCallback, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useLocaleCookie } from '../hooks/useLocaleCookie'
import { getServerSidePropsWithLocales } from '../utils/localeUtils'
import { trpc } from '../utils/trpc'

interface DashboardProps {
    me: Me
}

export const getServerSideProps = getServerSidePropsWithLocales

export default function DashboardPage() {
    const { data: me, isFetching } = trpc.me.useQuery()

    if (isFetching) {
        return null
    }

    return (
        <>
            <Head>
                <title>Yoota.</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            {me ? <Dashboard me={me} /> : <Login />}
        </>
    )
}

const Dashboard: FunctionComponent<DashboardProps> = ({ me }) => {
    const { myEvents, signOutButtonLabel } = useTranslations('dashboard')
    const { createSubTitle } = useTranslations('event')
    const format = useMessageFormatter('dashboard')
    const { setLocale } = useLocaleCookie()

    return (
        <>
            <Head>
                <title>Yoota. Dashboard</title>
            </Head>
            <Page dotBackdrop width="800px" padding={0}>
                <Card shadow>
                    <Grid.Container alignContent="center" alignItems="center">
                        <Text h3>{format('welcomeWithName', { name: me.name })}</Text>
                        <Spacer />
                        <Link href="/events" icon>
                            {myEvents}
                        </Link>
                        <Spacer />
                        <Button scale={0.5} onClick={() => setLocale('da')}>
                            da-DK
                        </Button>
                        <Spacer w={0.5} />
                        <Button scale={0.5} onClick={() => setLocale('en-US')}>
                            en-US
                        </Button>
                        <Spacer w={0.5} />
                    </Grid.Container>
                    <Divider />
                    <Text h5>{createSubTitle}</Text>
                    <Spacer />
                    <EventCreator />
                    <Spacer h={1} />
                    <Button icon={<UserMinus />} onClick={() => signOut()}>
                        {signOutButtonLabel}
                    </Button>
                </Card>
            </Page>
        </>
    )
}

const Login: FunctionComponent = () => {
    const { loginButtonLabel } = useTranslations('login')
    const { push } = useRouter()

    return (
        <>
            <Head>
                <title>Yoota.</title>
            </Head>
            <Page dotBackdrop width="1000px" padding={0}>
                <Button onClick={() => push('/login')}>{loginButtonLabel}</Button>
            </Page>
        </>
    )
}

const EventCreator: FunctionComponent = () => {
    const { createButtonLabel, namePlaceholder, descriptionPlaceholder } = useTranslations('event')
    const [timeZone, setTimeZone] = useState<TimeZone>()

    const { data: timeZones } = trpc.timeZone.all.useQuery(undefined, {
        onSuccess: data => {
            const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const initialTimeZone = data.find(timeZone => timeZone.utc.includes(browserTimeZone))
            setTimeZone(initialTimeZone)
        }
    })

    const nameRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const [days, setDays] = useState<Date[] | undefined>([])
    const { mutateAsync: createEvent, isLoading } = trpc.event.create.useMutation()
    const clickHandler = useCallback(async () => {
        assertIsDefined(nameRef.current)
        assertIsDefined(descriptionRef.current)
        assertIsDefined(timeZone, 'No time zone defined')

        const name = nameRef.current.value
        const description = descriptionRef.current.value
        const options = days?.map(date => ({
            startAt: date,
            endAt: date
        }))

        assertIsDefined(options, 'No date options defined')

        const event = await createEvent({
            name,
            description,
            timeZoneId: timeZone?.id,
            options
        })

        console.log('created event', event)
    }, [createEvent, days, timeZone])

    if (!timeZones) return <Loading />

    return (
        <Grid.Container direction="column">
            <Input placeholder={namePlaceholder} ref={nameRef} minLength={3} />
            <Spacer h={0.5} />
            <Input placeholder={descriptionPlaceholder} ref={descriptionRef} />
            <Spacer h={1} />
            <DayPicker mode="multiple" fromDate={new Date()} selected={days} onSelect={setDays} />
            <Spacer h={1} />
            <Grid>
                <Select
                    placeholder="Time zone"
                    value={timeZone?.id.toString()}
                    onChange={x => {
                        console.log(x)
                    }}
                >
                    {timeZones.map(({ value, id, text }) => (
                        <Select.Option value={id.toString()} key={id}>
                            {text}
                        </Select.Option>
                    ))}
                </Select>
            </Grid>
            <Spacer h={1} />
            <Grid>
                <Button
                    icon={<PlusCircle />}
                    onClick={clickHandler}
                    loading={isLoading}
                    disabled={!days || days.length === 0}
                >
                    {createButtonLabel}
                </Button>
            </Grid>
        </Grid.Container>
    )
}
