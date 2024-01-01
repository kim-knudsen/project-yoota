import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTranslations } from '@yoota/i18n'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { Calendar, CalendarProps } from 'react-native-calendars'
import { DateData, MarkedDates } from 'react-native-calendars/src/types'
import ScreenBackground from '../../components/ScreenBackground'
import { useMe } from '../../hooks/useMe'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>

const CreateEventScreen: FC<Props> = ({ navigation }) => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>()
    const [selected, setSelected] = useState<MarkedDates>({})
    const { createButtonLabel, descriptionPlaceholder, namePlaceholder, timeZoneLabel } = useTranslations('event')
    const { mutateAsync: createEvent } = trpc.event.create.useMutation()
    const { data: timeZones } = trpc.timeZone.all.useQuery()
    // TODO: Do not require to be signed in to create event.
    const { me } = useMe()
    const selectedDates = useMemo(
        () => Object.keys(selected).filter(key => selected[key].selected === true),
        [selected]
    )

    // TODO: Make Timezone selector
    const selectedTimeZoneId = 43
    const timeZoneText = timeZones?.find(t => t.id === selectedTimeZoneId)?.text

    const onDayPress: CalendarProps['onDayPress'] = useCallback(
        (day: DateData) => {
            const dateString = day.dateString
            const marked = selected[dateString]?.selected ?? false
            setSelected(prev => ({ ...prev, [dateString]: { selected: !marked } }))
        },
        [selected]
    )

    const onSubmitHandler = useCallback(async () => {
        try {
            await createEvent({
                name: title,
                description: description,
                options: selectedDates.map(d => ({
                    startAt: new Date(d),
                    endAt: new Date(d)
                })),
                timeZoneId: selectedTimeZoneId
            })
            navigation.pop()
        } catch (error) {}
    }, [createEvent, title, description, selectedDates, navigation])

    return (
        <ScreenBackground>
            <View style={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 20 }}>
                <TextInput placeholder={namePlaceholder} style={styles.textInput} onChangeText={val => setTitle(val)} />
                <TextInput
                    placeholder={descriptionPlaceholder}
                    style={styles.textInput}
                    onChangeText={val => setDescription(val)}
                />

                <Calendar
                    theme={{
                        textDayFontFamily: 'System',
                        textDayFontWeight: '500',
                        textMonthFontFamily: 'System',
                        textDayHeaderFontFamily: 'System',
                        textMonthFontWeight: '800',
                        selectedDayBackgroundColor: 'black',
                        todayTextColor: 'black',
                        calendarBackground: 'transparent'
                    }}
                    monthFormat="MMMM yy"
                    onDayPress={onDayPress}
                    minDate={new Date().toISOString()}
                    firstDay={1}
                    markedDates={selected}
                    calendarHeight={320}
                />
                <View style={{ padding: 12, marginTop: 20, borderColor: 'grey', borderWidth: 1, borderRadius: 12 }}>
                    <Text style={{ color: 'grey', fontWeight: '700' }}>{timeZoneLabel}</Text>
                    <Text style={{ color: 'grey' }}>{timeZoneText}</Text>
                </View>
            </View>
            <Button
                disabled={!title || selectedDates.length < 1 || !me}
                onPress={onSubmitHandler}
                title={createButtonLabel}
            />
        </ScreenBackground>
    )
}

export default CreateEventScreen

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
