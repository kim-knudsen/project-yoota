import { range } from 'rambda'
import React, { FunctionComponent, useCallback } from 'react'
import { Button, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { OptionDate } from './ParticipateSelector'

export const PS_COLUMN_WIDTH = 120
export const PS_SECTION_GAP = 0
export const PS_HEADER_HEIGHT = 80
export const PS_CHECKBOX_HEIGHT = 60
export const PS_COLUMN_PADDING = 6

const sepColor = '#ddd'
const sepColorDark = '#ccc'
const selectedColor = '#95dd00'

interface Props {
    optionDate: OptionDate
    onOptionPress: (id: number) => void
    selected: boolean
    totalParticipants: number
    onViewParticipantsPress: (id: number) => void
    viewParticipantsSelected: boolean
}

const ParticipateSelectorOption: FunctionComponent<Props> = ({
    optionDate,
    onOptionPress,
    selected,
    totalParticipants,
    onViewParticipantsPress,
    viewParticipantsSelected
}) => {
    const { startDay, startMonth, startYear, countParticipants } = optionDate

    const onPressHandler = useCallback(() => {
        onViewParticipantsPress(optionDate.id)
    }, [onViewParticipantsPress, optionDate.id])

    return (
        <View>
            <View
                style={{
                    width: PS_COLUMN_WIDTH,
                    paddingBottom: 60,
                    marginBottom: 20,
                    borderColor: viewParticipantsSelected ? selectedColor : 'transparent',
                    borderWidth: 1,
                    backgroundColor: viewParticipantsSelected ? 'white' : 'transparent'
                }}
            >
                <View
                    style={{
                        height: PS_HEADER_HEIGHT,
                        paddingBottom: 16,
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Text style={{ fontSize: 20, fontWeight: '900', marginBottom: 3 }}>{startDay}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12, fontWeight: '300' }}>{startMonth}</Text>
                        <Text style={{ fontSize: 12, fontWeight: '300' }}>{startYear}</Text>
                    </View>
                </View>

                <Checkbox onPress={() => onOptionPress(optionDate.id)} selected={selected} />
                <View style={{ height: 80, paddingHorizontal: PS_COLUMN_PADDING, alignItems: 'center' }}>
                    {countParticipants === 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 1, backgroundColor: sepColor }} />
                        </View>
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            paddingTop: 10,
                            paddingHorizontal: 10,
                            marginBottom: 10
                        }}
                    >
                        {totalParticipants !== 0 &&
                            range(0, totalParticipants).map(index => (
                                <ParticipantBullet selected={countParticipants > index} key={index} />
                            ))}
                    </View>

                    <Button onPress={onPressHandler} title={'View'} disabled={countParticipants === 0} />
                </View>
            </View>
        </View>
    )
}

export default ParticipateSelectorOption

export const ParticipateSelectorSectionSeperator: FunctionComponent = () => (
    <View
        style={{
            width: PS_SECTION_GAP,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
        }}
    >
        {/* <View style={{ height: '80%', width: 3, backgroundColor: sepColor }} /> */}
    </View>
)

interface CheckboxProps {
    onPress: () => void
    selected: boolean
}

const Checkbox: FunctionComponent<CheckboxProps> = ({ selected, onPress }) => (
    <TouchableOpacity style={{ paddingHorizontal: PS_COLUMN_PADDING }} onPress={onPress} activeOpacity={0.9}>
        <View
            style={{
                height: PS_CHECKBOX_HEIGHT,
                borderColor: selected ? selectedColor : sepColor,
                borderWidth: 1,
                backgroundColor: selected ? selectedColor : 'white'
            }}
        >
            {!selected && (
                <>
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0)']}
                        style={{ position: 'absolute', height: 6, left: 0, right: 0, top: 0 }}
                    />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0)']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        style={{ position: 'absolute', width: 6, top: 0, bottom: 0, left: 0 }}
                    />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.04)', 'rgba(0, 0, 0, 0)']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        style={{ position: 'absolute', width: 6, top: 0, bottom: 0, right: 0 }}
                    />
                </>
            )}
        </View>
    </TouchableOpacity>
)

const ParticipantBullet: FunctionComponent<{ selected: boolean }> = ({ selected }) => {
    const style = selected
        ? { borderColor: selectedColor, backgroundColor: selectedColor }
        : { borderColor: sepColorDark, backgroundColor: 'white' }

    return (
        <View
            style={[
                {
                    marginTop: 5,
                    marginHorizontal: 3,
                    height: 12,
                    width: 12,
                    borderRadius: 20,
                    borderWidth: 1,
                    backgroundColor: selected ? selectedColor : 'white'
                },
                style
            ]}
        />
    )
}
