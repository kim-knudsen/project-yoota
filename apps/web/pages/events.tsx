import { Card, Grid, Link, Page, Text } from '@geist-ui/core'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

import type { RouterOutput } from '@yoota/api'
import { FunctionComponent } from 'react'
import { getSSGHelpers } from '../utils/getSSGHelpers'
import { trpc } from '../utils/trpc'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    try {
        const { ssg, locale } = await getSSGHelpers(req, res)

        await Promise.all([ssg.event.organizing.fetch(), ssg.me.fetch()])

        return {
            props: {
                trpcState: ssg.dehydrate(),
                locale
            }
        }
    } catch {
        return {
            props: {}
        }
    }
}

const Events: FunctionComponent = () => {
    const { data: me, isFetching } = trpc.me.useQuery()
    const { data: events } = trpc.event.organizing.useQuery()

    if (!isFetching && !me) {
        return <Text>Not logged in</Text>
    }

    return (
        <>
            <Head>
                <title>My events.</title>
            </Head>
            <Page dotBackdrop width="800px" padding={0}>
                <Card shadow>
                    {me && <Text h5>{`My (${me.name} - ${me.email}) events`}</Text>}
                    {events && (
                        <>
                            <EventList name="As Organiser" events={events} />
                        </>
                    )}
                </Card>
            </Page>
        </>
    )
}

interface EventListProps {
    name: string
    events: RouterOutput['event']['organizing']
}

const EventList: FunctionComponent<EventListProps> = ({ name, events }) => {
    if (events.length === 0) return null

    return (
        <Grid.Container direction="column">
            <Text h3>{name}</Text>
            {events.map(({ id, name }) => (
                <Link icon href={`/e/${id}`} key={id}>
                    {name}
                </Link>
            ))}
        </Grid.Container>
    )
}

export default Events
