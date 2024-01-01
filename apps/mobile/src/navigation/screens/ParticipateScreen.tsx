import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { assertIsDefined } from '@yoota/common'
import { useIntl, useTranslations } from '@yoota/i18n'
import { any, append, count, groupWith, intersperse, reject } from 'rambda'
import React, { FC, useCallback, useLayoutEffect, useState } from 'react'
import { Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ParticipateSelector, { OptionDate, OptionDateRangeData } from '../../components/ParticipateSelector'
import WireframeMarker from '../../components/WireframeMarker'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'Participate'>

const ParticipateScreen: FC<Props> = ({ route, navigation }) => {
    const { eventId } = route.params
    const translations = useTranslations('participate')
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])
    const [viewSelectedOption, setViewSelectedOption] = useState<number>()
    const [name, setName] = useState('')
    const { data: event } = trpc.event.byId.useQuery({ id: eventId })
    const { mutateAsync: participate } = trpc.event.participate.useMutation()

    const { formatDate } = useIntl()

    const participatePressHandler = useCallback(async () => {
        assertIsDefined(event)
        await participate({
            eventId: event.id,
            name,
            options: selectedOptions
        })
    }, [event, name, selectedOptions, participate])

    const onOptionPressHandler = useCallback(
        (id: number) => {
            const foundId = selectedOptions.find(optionId => optionId === id)
            if (foundId) {
                setSelectedOptions(reject(optionId => optionId === id, selectedOptions))
            } else {
                setSelectedOptions(append(id, selectedOptions))
            }
        },
        [selectedOptions]
    )

    const onViewParticipantsPressHandler = useCallback(
        (id: number) => {
            if (id === viewSelectedOption) {
                setViewSelectedOption(undefined)
            } else {
                setViewSelectedOption(id)
            }
        },
        [setViewSelectedOption, viewSelectedOption]
    )

    useLayoutEffect(() => {
        const renderHeaderRight = () => (
            <Button title={translations.closeButtonLabel} onPress={() => navigation.pop()} />
        )
        navigation.setOptions({
            title: event?.name,
            headerRight: renderHeaderRight
        })
    }, [event, navigation, translations])

    if (!event) return null

    const { participants } = event

    const optionFormatted: OptionDate[] = event.options.map(option => {
        const startDay = formatDate(option.startAt, { day: '2-digit' })
        const startWeekday = formatDate(option.startAt, { weekday: 'short' })
        const startMonth = formatDate(option.startAt, { month: 'short' })
        const startYear = formatDate(option.startAt, { year: 'numeric' })
        const startDate = option.startAt
        const countParticipants = count(
            participant => any(vote => vote.optionId === option.id, participant.votes),
            participants
        )
        return {
            startDate,
            startWeekday,
            startDay,
            startMonth,
            startYear,
            firstItem: false,
            lastItem: false,
            centeredItem: false,
            countParticipants,
            id: option.id
        }
    })

    const groupedOptions = groupWith((a, b) => diffDates(a.startDate, b.startDate) === 1, optionFormatted)
    const optionsPosition = groupedOptions.map(group =>
        group.map((item, index) => ({ ...item, firstItem: index === 0, lastItem: index === group.length - 1 }))
    )
    const sections = intersperse<OptionDateRangeData>([{ daysBetween: 3 }], optionsPosition).flat()

    const participantsForViewedOption = participants.filter(participant =>
        any(vote => vote.optionId === viewSelectedOption, participant.votes)
    )

    return (
        <View style={{ flex: 1, paddingTop: 20 }}>
            <WireframeMarker />
            <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
                <Text style={{ fontSize: 16, color: 'grey', textAlign: 'center' }}>{event?.description}</Text>
            </View>
            <View style={{ paddingVertical: 0 }}>
                <ParticipateSelector
                    data={sections}
                    selectedOptions={selectedOptions}
                    onOptionPress={onOptionPressHandler}
                    totalParticipants={participants.length}
                    onViewParticipantsPress={onViewParticipantsPressHandler}
                    viewSelectedOption={viewSelectedOption}
                />
            </View>
            <View style={{ paddingHorizontal: 20, paddingBottom: 30, height: 160 }}>
                {viewSelectedOption && (
                    <View style={{ backgroundColor: 'white' }}>
                        <WireframeMarker text="Show in small overlay" />
                        <ScrollView contentContainerStyle={{ padding: 20 }}>
                            {participantsForViewedOption.map((participant, index) => (
                                <Text key={index} style={{ fontSize: 14, marginBottom: 3 }}>
                                    {participant.name}
                                </Text>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
            <View style={{ paddingHorizontal: 20, paddingBottom: 60, flex: 1, justifyContent: 'flex-end' }}>
                <View style={{ paddingBottom: 20 }}>
                    <TextInput
                        placeholder="Enter name"
                        value={name}
                        onChangeText={setName}
                        style={{ fontSize: 20, height: 60, backgroundColor: 'white', paddingHorizontal: 10 }}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.6} onPress={participatePressHandler}>
                    <View
                        style={{
                            height: 60,
                            backgroundColor: '#43ad05',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10
                        }}
                    >
                        <Text style={{ fontSize: 20, color: 'white' }}>{'Participate'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ParticipateScreen

const diffDates = (date1: Date, date2: Date) => {
    const value = date1.getTime() - date2.getTime()
    const diffTime = Math.abs(value)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}
