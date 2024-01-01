import { Callback } from '@yoota/client'
import React, { FC, ReactElement } from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'

interface Props {
    onPress: Callback
    children: ReactElement
    style?: ViewStyle
}

const BoxTouch: FC<Props> = ({ onPress, children, style }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={[
            {
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 0.23,
                shadowRadius: 5,
                paddingVertical: 30,
                paddingHorizontal: 20,
                borderRadius: 12,
                backgroundColor: 'white'
            },
            style
        ]}
    >
        {children}
    </TouchableOpacity>
)

export default BoxTouch
