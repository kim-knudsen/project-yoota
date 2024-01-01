import {
    Button,
    Capacity,
    Card,
    Code,
    Collapse,
    Display,
    Divider,
    Grid,
    Input,
    Loading,
    Modal,
    Page,
    Spacer,
    Tag,
    Text,
    useTheme
} from '@geist-ui/core'
import { Delete, Edit, PlusCircle } from '@geist-ui/icons'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import { appRouter } from '@yoota/api'
import { Event, Participant } from '@yoota/client'
import { assertIsDefined } from '@yoota/common'
import { prisma } from '@yoota/db'
import { compareAsc, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import superjson from 'superjson'
import { logger } from '../../../utils/logger'
import { trpc } from '../../../utils/trpc'

interface EventProps {
    id: string
}
interface DateStatus {
    date: Date
    percentage: number
    participants: ReadonlyArray<Participant>
    optionId: number
}

interface StatusReport {
    event: Event
    statuses: ReadonlyArray<DateStatus>
}

const log = logger('EventPage')

export const getServerSideProps: GetServerSideProps<EventProps> = async ({ params }) => {
    const id = params?.id

    if (typeof id === 'string') {
        const ssg = createProxySSGHelpers({
            router: appRouter,
            // @ts-ignore
            ctx: {
                prisma,
                session: null
            },
            transformer: superjson // optional - adds superjson serialization
        })

        try {
            await ssg.event.byId.fetch({ id })

            return {
                props: {
                    trpcState: ssg.dehydrate(),
                    id
                }
            }
        } catch (error) {
            log.error(error)
        }
    }

    return notFound
}

export default function EventPage({ id }: EventProps) {
    const { data: event, isLoading, error } = trpc.event.byId.useQuery({ id })
    const { mutateAsync: deleteEvent, isLoading: isDeleting } = trpc.event.delete.useMutation()
    const { mutateAsync: participate, isLoading: isParticipating } = trpc.event.participate.useMutation()
    const eventDays = useEventDays(event)
    const trpcContext = trpc.useContext()
    const emailInputRef = useRef<HTMLInputElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)
    const statusReport = useMemo(() => (event ? createStatusReport(event) : null), [event])

    const participateClickHandler = useCallback(async () => {
        assertIsDefined(eventDays)
        assertIsDefined(nameInputRef.current)
        assertIsDefined(emailInputRef.current)
        assertIsDefined(event)

        const { optionIds } = eventDays
        const email = stringOrNull(emailInputRef.current.value)

        const { id: participantId } = await participate({
            eventId: id,
            name: nameInputRef.current.value,
            email,
            options: optionIds
        })

        log.debug({ participantId })

        eventDays.setSelectedDays([])
        trpcContext.event.byId.invalidate({ id })
    }, [event, eventDays, id, participate, trpcContext.event.byId])

    const deleteClickHandler = useCallback(async () => {
        try {
            await deleteEvent({ eventId: id })
        } finally {
            trpcContext.event.byId.invalidate({ id })
        }
    }, [deleteEvent, id, trpcContext.event.byId])

    if (isLoading) return <LoadingPage />
    if (error) return <ErrorPage error={error} />

    assertIsDefined(event)
    assertIsDefined(eventDays)
    assertIsDefined(statusReport)

    return (
        <>
            <Head>
                <title>{event.name}</title>
                <meta name="description" content={event.description ?? event.name} />
            </Head>
            <Page dotBackdrop width="800px" padding={0}>
                <Card shadow>
                    <Grid.Container direction="column">
                        <EventHeader event={event} />
                        <Spacer />
                        <Divider />
                        <Text h5>Status</Text>
                        <StatusReportView statusReport={statusReport} />
                        <Divider />
                        <Text h5>Please select suitable days</Text>
                        <DayPicker
                            mode="multiple"
                            disabled={eventDays.disabledDates}
                            fromDate={eventDays.firstDate}
                            toDate={eventDays.lastDate}
                            selected={eventDays.selectedDays}
                            onSelect={eventDays.setSelectedDays}
                        />
                        <Text>Participate as</Text>
                        <Input placeholder="Name" ref={nameInputRef} />
                        <Spacer h={1} />
                        <Input placeholder="Email" ref={emailInputRef} />
                        <Spacer h={1} />
                        <Grid>
                            <Button
                                icon={<PlusCircle />}
                                onClick={participateClickHandler}
                                loading={isParticipating}
                                disabled={eventDays.setSelectedDays.length === 0}
                            >
                                Participate
                            </Button>
                            <Spacer h={1} />
                            <Button
                                type="warning-light"
                                icon={<Delete />}
                                onClick={deleteClickHandler}
                                loading={isDeleting}
                            >
                                Delete
                            </Button>
                        </Grid>
                        <Spacer h={1} />
                        <Collapse.Group>
                            <Collapse title="Event - JSON Dump" scale={0.3}>
                                <Display width="600px" caption="Raw JSON dump">
                                    <Code block>{JSON.stringify(event, null, 2)}</Code>
                                </Display>
                            </Collapse>
                        </Collapse.Group>
                    </Grid.Container>
                </Card>
            </Page>
        </>
    )
}

const EventHeader: FunctionComponent<{ event: Event }> = ({ event }) => {
    const [modalState, setModalState] = useState<{ open: boolean }>({ open: false })
    const { mutateAsync: updateEvent } = trpc.event.update.useMutation()
    const trpcContext = trpc.useContext()
    const showModal = () => setModalState({ open: true })
    const closeModal = () => setModalState({ open: false })
    const [days, setDays] = useState<Date[] | undefined>([])
    const fromDate = useMemo(() => {
        const [date] = [new Date(), ...event.options.map(option => option.startAt)].sort(compareAsc)
        return date
    }, [event.options])
    const nameInputRef = useRef<HTMLInputElement>(null)
    const descriptionInputRef = useRef<HTMLInputElement>(null)

    const editClickHandler = useCallback(() => {
        setDays(event.options.map(({ startAt }) => startAt))
        showModal()
    }, [event])

    const onSaveHandler = useCallback(async () => {
        assertIsDefined(days)

        const name = nameInputRef.current?.value
        const description = stringOrNull(descriptionInputRef.current?.value)

        const toDelete = event.options
            .filter(({ startAt }) => days.every(date => !isSameDay(startAt, date)))
            .map(({ id }) => ({ id }))

        const toAdd = days
            .filter(date => event.options.every(({ startAt }) => !isSameDay(startAt, date)))
            .map(date => ({ startAt: date, endAt: date }))

        const updatedEvent = await updateEvent({
            id: event.id,
            name,
            description,
            options: { add: toAdd, delete: toDelete }
        })

        trpcContext.event.byId.setData({ id: event.id }, updatedEvent)
        closeModal()
    }, [days, event.id, event.options, trpcContext.event.byId, updateEvent])

    return (
        <>
            <Grid.Container>
                <Text h3 style={{ marginBottom: 0 }}>
                    {event.name}
                </Text>
                <Spacer />
                <span style={{ cursor: 'pointer' }} onClick={editClickHandler}>
                    <Edit size={16} />
                </span>
            </Grid.Container>
            <Text small>{event.description}</Text>
            <Modal visible={modalState.open} onClose={closeModal}>
                <Modal.Title>{event.name}</Modal.Title>
                <Modal.Subtitle>{event.description}</Modal.Subtitle>
                <Modal.Content>
                    <Input placeholder="Name" initialValue={event.name} ref={nameInputRef} width="100%" />
                    <Spacer />
                    <Input
                        placeholder="Description"
                        initialValue={event.description ?? ''}
                        ref={descriptionInputRef}
                        width="100%"
                    />
                    <Spacer />
                    <Divider />
                    <DayPicker mode="multiple" fromDate={fromDate} selected={days} onSelect={setDays} />
                </Modal.Content>
                <Modal.Action passive onClick={closeModal}>
                    Cancel
                </Modal.Action>
                <Modal.Action onClick={onSaveHandler}>Save</Modal.Action>
            </Modal>
        </>
    )
}

const getSelectedParticipantDates = (event: Event, participant: Participant) =>
    event.options
        .filter(({ id }) => participant.votes.some(({ optionId }) => optionId === id))
        .map(({ startAt }) => startAt)

const useEventDays = (event: Event | undefined) => {
    const [selectedDays, setSelectedDays] = useState<Date[] | undefined>([])
    const data = useMemo(() => {
        if (!event) return null
        const dates = event.options.map(option => option.startAt).sort(compareAsc)
        const [firstDate] = dates
        const lastDate = dates[dates.length - 1]
        // Determine disbaled/enablded days
        const interval = eachDayOfInterval({ start: firstDate, end: lastDate }, {})
        const disabledDates = interval.filter(a => !dates.some(b => isSameDay(a, b)))

        return {
            firstDate,
            lastDate,
            disabledDates
        }
    }, [event])

    // Determine options from selected days
    const optionIds = useMemo(
        () =>
            event && selectedDays
                ? selectedDays.map(day => {
                      const option = event.options.find(option => isSameDay(option.startAt, day))
                      assertIsDefined(option, 'Option not found')
                      return option.id
                  })
                : [],
        [event, selectedDays]
    )

    return (
        data && {
            firstDate: data.firstDate,
            lastDate: data.lastDate,
            disabledDates: data.disabledDates,
            selectedDays,
            setSelectedDays,
            optionIds
        }
    )
}

const StatusReportView: FunctionComponent<{ statusReport: StatusReport }> = ({ statusReport }) => {
    const theme = useTheme()
    const eventDays = useEventDays(statusReport.event)
    const { mutateAsync: updateParticipant } = trpc.event.updateParticipant.useMutation()
    const trpcContext = trpc.useContext()
    const [modalState, setModalState] = useState<{ open: boolean; participant?: Participant }>({ open: false })
    const showModal = (participant: Participant) => {
        eventDays?.setSelectedDays(getSelectedParticipantDates(statusReport.event, participant))
        setModalState({ open: true, participant })
    }
    const closeModal = useCallback(() => {
        eventDays?.setSelectedDays([])
        setModalState(prev => ({ ...prev, open: false }))
    }, [eventDays])
    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const onSaveHandler = useCallback(async () => {
        const { participant } = modalState

        assertIsDefined(participant)
        assertIsDefined(eventDays)

        const emailInput = emailInputRef.current?.value.trim()
        const email = typeof emailInput === 'string' && emailInput.length > 0 ? emailInput : null
        const votes = eventDays.optionIds.map(id => ({ optionId: id }))

        await updateParticipant({ id: participant.id, name: nameInputRef.current?.value, email, votes })
        await trpcContext.event.byId.invalidate({ id: statusReport.event.id })
        closeModal()
    }, [closeModal, eventDays, modalState, statusReport.event.id, trpcContext.event.byId, updateParticipant])

    if (statusReport.statuses.length === 0) {
        return <Text>No status report</Text>
    }

    assertIsDefined(eventDays, 'Expected eventDays to be defined')

    const { disabledDates, firstDate, lastDate, selectedDays, setSelectedDays } = eventDays

    return (
        <>
            <Grid.Container direction="column">
                {statusReport.statuses.map(({ date, percentage, participants }) => (
                    <Grid key={date.toString()}>
                        <Text h6>{format(date, 'MM/dd/yyyy')}</Text>
                        <Capacity value={percentage} color={theme.palette.success} />
                        <Spacer />
                        <Grid.Container gap={1}>
                            {participants.map(participant => (
                                <Grid key={participant.name}>
                                    <Tag
                                        type="lite"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            showModal(participant)
                                        }}
                                    >
                                        {participant.name}
                                    </Tag>
                                </Grid>
                            ))}
                        </Grid.Container>
                        <Spacer />
                    </Grid>
                ))}
            </Grid.Container>
            <Modal visible={modalState.open} onClose={closeModal}>
                <Modal.Title>{modalState.participant?.name}</Modal.Title>
                <Modal.Subtitle>{modalState.participant?.email}</Modal.Subtitle>
                <Modal.Content>
                    <Input
                        placeholder="Name"
                        initialValue={modalState.participant?.name}
                        ref={nameInputRef}
                        width="100%"
                    />
                    <Spacer />
                    <Input
                        placeholder="Email"
                        initialValue={modalState.participant?.email ?? ''}
                        ref={emailInputRef}
                        width="100%"
                    />
                    <Spacer />
                    <Divider />
                    <DayPicker
                        mode="multiple"
                        disabled={disabledDates}
                        fromDate={firstDate}
                        toDate={lastDate}
                        selected={selectedDays}
                        onSelect={setSelectedDays}
                    />
                </Modal.Content>
                <Modal.Action passive onClick={closeModal}>
                    Cancel
                </Modal.Action>
                <Modal.Action onClick={onSaveHandler}>Save</Modal.Action>
            </Modal>
        </>
    )
}

const createStatusReport = (event: Event): StatusReport => {
    const { participants, options } = event

    const statuses: ReadonlyArray<DateStatus> = options
        .map(option => {
            const date = option.startAt
            const participantsForDate = participants.filter(participant =>
                participant.votes.some(({ optionId }) => optionId === option.id)
            )

            return {
                date,
                percentage: (participantsForDate.length / participants.length) * 100,
                participants: participantsForDate,
                optionId: option.id
            }
        })
        .sort((a, b) => b.percentage - a.percentage)

    return {
        event,
        statuses
    }
}

const stringOrNull = (value: string | undefined) => {
    if (!value) return null
    const trimmed = value.trim()
    return trimmed.length === 0 ? null : trimmed
}

const LoadingPage: FunctionComponent = () => (
    <>
        <Head>
            <title>Loading...</title>
        </Head>
        <Page dotBackdrop width="1000px" padding={50}>
            <Grid.Container justify="center">
                <Loading />
            </Grid.Container>
        </Page>
    </>
)

const ErrorPage: FunctionComponent<{ error?: unknown }> = () => (
    <>
        <Head>
            <title>Error</title>
        </Head>
        <Page dotBackdrop width="1000px" padding={50}>
            <Grid.Container justify="center">
                <Text h1>Error</Text>
            </Grid.Container>
        </Page>
    </>
)

const notFound = {
    // returns the default 404 page with a status code of 404
    notFound: true
} as const
