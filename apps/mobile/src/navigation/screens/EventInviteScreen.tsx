import { faArrowRightLong, faCheck, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIntl, useTranslations } from '@yoota/i18n'
import { ColorScheme } from '@yoota/theme'
import { any, append, count, groupBy, reject } from 'rambda'
import React, { FC, useCallback, useState } from 'react'
import { FlatList, Text as RNText, ScrollView, TouchableOpacity, View } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { OptionDate } from '../../components/ParticipateSelector'
import ScreenBackground from '../../components/ScreenBackground'
import { useMe } from '../../hooks/useMe'
import Button from '../../ui/components/Button'
import GridView from '../../ui/components/GridView'
import Text from '../../ui/components/Text'
import TextInputField from '../../ui/components/TextInputField'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'EventInvite'>
const EventInviteScreen: FC<Props> = ({ route }) => {
    const { eventId } = route.params
    const { data: event } = trpc.event.byId.useQuery({ id: eventId })
    const { formatDate } = useIntl()
    const { me } = useMe()

    const [selectedOptions, setSelectedOptions] = useState<Array<number>>([])
    const [participantName, setParticipantName] = useState(me?.name ?? '')
    const { mutateAsync: participate, isLoading: participateIsLoading } = trpc.event.participate.useMutation()
    const { nameInputLabel, nameInputPlaceholder, selectOptionsDescription, submitButtonLabel, screenTitle } =
        useTranslations('invitation')
    const participateButtonDisabled = participantName.length < 1 || participateIsLoading

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

    const onSubmitHandler = useCallback(() => {
        participate({ eventId, name: participantName, options: selectedOptions, email: me?.email })
    }, [eventId, me?.email, participantName, participate, selectedOptions])

    if (!event) return null

    const { participants } = event

    const optionFormatted: OptionDate[] = event.options.map(option => {
        const startDay = option.startAt.getDate().toString()
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
            startDay,
            startMonth,
            startWeekday,
            startYear,
            firstItem: false,
            lastItem: false,
            centeredItem: false,
            countParticipants,
            id: option.id
        }
    })

    const sections = groupBy(
        option => formatDate(option.startDate, { month: 'long', year: 'numeric' }),
        optionFormatted.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    )

    const sectionList = Object.keys(sections).map(section => ({
        title: section,
        data: sections[section]
    }))

    return (
        <ScreenBackground screenTitle={screenTitle}>
            <ScrollView style={{ flex: 1 }}>
                <GridView innerVertical="medium" innerHorizontal="medium">
                    <Text text={event.name} size={22} weight="black" />
                    {event.description && <Text text={event.description} size={16} weight="regular" color="grey" />}
                </GridView>
                <GridView innerHorizontal="medium">
                    <TextInputField
                        label={nameInputLabel}
                        placeholder={nameInputPlaceholder}
                        clearButtonMode="while-editing"
                        onChangeText={text => setParticipantName(text)}
                    />
                </GridView>
                <GridView innerHorizontal="medium" innerBottom="small">
                    <Text text={selectOptionsDescription} color="grey" />
                </GridView>

                <GridView innerBottom="medium">
                    {sectionList.map((section, index) => (
                        <View key={index}>
                            <GridView innerHorizontal="medium">
                                <Text text={section.title} size={16} weight="bold" />
                            </GridView>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                                data={section.data}
                                horizontal
                                renderItem={({ item }) => (
                                    <Option
                                        key={item.id}
                                        option={item}
                                        onPress={onOptionPressHandler}
                                        selected={selectedOptions.includes(item.id)}
                                        participants={item.countParticipants}
                                    />
                                )}
                            />
                        </View>
                    ))}
                </GridView>
                <GridView innerHorizontal="medium" outerBottom="xl">
                    <Button
                        title={submitButtonLabel}
                        onPress={onSubmitHandler}
                        disabled={participateButtonDisabled}
                        icon={faArrowRightLong}
                    />
                </GridView>
            </ScrollView>
        </ScreenBackground>
    )
}

export default EventInviteScreen

interface OptionProps {
    option: OptionDate
    selected: boolean
    onPress: (id: OptionDate['id']) => void
    participants: number
}
const Option: FC<OptionProps> = ({ selected, option, participants, onPress }) => {
    const scaleValue = useSharedValue(1)

    const style = useAnimatedStyle(
        () => ({
            transform: [{ scale: scaleValue.value }]
        }),
        []
    )
    const { width } = useSafeAreaFrame()
    return (
        <TouchableOpacity
            onPress={() => {
                ReactNativeHapticFeedback.trigger('impactLight')
                scaleValue.value = withSequence(
                    withTiming(1.2, { duration: 100, easing: Easing.ease }),
                    withTiming(1, { duration: 80 })
                )
                onPress(option.id)
            }}
            style={{ width: (width - 4 * 20 + 10) / 3.5, padding: selected ? 0 : 2, marginRight: 10 }}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    {
                        borderWidth: selected ? 2 : 0,
                        borderRadius: 8,
                        borderColor: ColorScheme.zobkov.lightGreen,
                        shadowColor: selected ? ColorScheme.zobkov.green : ColorScheme.grey.shade03,
                        shadowOpacity: selected ? 0.4 : 0.3,
                        shadowRadius: 5,
                        marginTop: 10,
                        shadowOffset: { width: 0, height: 0 }
                    },
                    style
                ]}
            >
                <View
                    style={{
                        backgroundColor: ColorScheme.white.normal,
                        borderRadius: 8,
                        overflow: 'hidden'
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 5,
                            backgroundColor: selected
                                ? ColorScheme.zobkov.tintedLighttGreen
                                : ColorScheme.zobkov.tintedLightGrey,
                            paddingTop: 10,
                            paddingBottom: 8,
                            borderBottomColor: ColorScheme.zobkov.whisper,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text text={option.startWeekday} align="center" />
                        <Text
                            text={option.startDay}
                            align="center"
                            size={22}
                            weight="bold"
                            style={{ lineHeight: 27 }}
                        />
                        <View style={{ height: 8, justifyContent: 'center', alignItems: 'center' }}>
                            {selected && (
                                <FontAwesomeIcon icon={faCheck} color={ColorScheme.zobkov.neonGreen} size={13} />
                            )}
                        </View>
                    </View>
                    <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesomeIcon
                            icon={faUser}
                            color={ColorScheme.grey.shade06}
                            size={10}
                            style={{ marginRight: 3 }}
                        />
                        <RNText
                            style={{
                                fontSize: 10,
                                textAlign: 'center',
                                fontFamily: 'NotoSansJP-Regular',
                                lineHeight: 13
                            }}
                        >
                            {selected ? participants + 1 : participants}
                        </RNText>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    )
}
