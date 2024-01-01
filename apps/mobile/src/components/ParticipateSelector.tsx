import { includes } from 'rambda/immutable'
import React, { FunctionComponent } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import ParticipateSelectorOption, { ParticipateSelectorSectionSeperator } from './ParticipateSelectorOption'

export interface OptionDate {
    startDay: string
    startWeekday: string
    startMonth: string
    startYear: string
    startDate: Date
    countParticipants: number
    firstItem: boolean
    lastItem: boolean
    id: number
}

export interface OptionDateRangeSeperator {
    daysBetween: number
}

export type OptionDateRangeData = (OptionDate | OptionDateRangeSeperator)[]

interface Props {
    data: OptionDateRangeData
    selectedOptions: ReadonlyArray<number>
    onOptionPress: (id: number) => void
    totalParticipants: number
    onViewParticipantsPress: (id: number) => void
    viewSelectedOption: number | undefined
}

const ParticipateSelector: FunctionComponent<Props> = ({
    data,
    onOptionPress,
    selectedOptions,
    totalParticipants,
    onViewParticipantsPress,
    viewSelectedOption
}) => {
    const renderItem: ListRenderItem<OptionDate | OptionDateRangeSeperator> = ({ item }) => {
        if (isOptionDate(item)) {
            const selected = includes(item.id, selectedOptions)
            return (
                <ParticipateSelectorOption
                    optionDate={item}
                    onOptionPress={onOptionPress}
                    selected={selected}
                    totalParticipants={totalParticipants}
                    onViewParticipantsPress={onViewParticipantsPress}
                    viewParticipantsSelected={viewSelectedOption === item.id}
                />
            )
        }
        if (isOptionDateRangeSeperator(item)) {
            return <ParticipateSelectorSectionSeperator />
        }
        return null
    }

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            horizontal={true}
            keyExtractor={(item, index) => (isOptionDate(item) ? `${item.id}option` : `${index}seperator`)}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        />
    )
}

export default ParticipateSelector

function isOptionDateRangeSeperator(best: OptionDate | OptionDateRangeSeperator): best is OptionDateRangeSeperator {
    return (best as unknown as OptionDateRangeSeperator).daysBetween !== undefined
}

function isOptionDate(best: OptionDate | OptionDateRangeSeperator): best is OptionDate {
    return (best as unknown as OptionDate).startDate !== undefined
}
