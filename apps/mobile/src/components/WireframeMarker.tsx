import React, { FunctionComponent } from 'react'
import { StyleProp, Text, ViewStyle } from 'react-native'

interface Props {
    style?: StyleProp<ViewStyle>
    text?: string
}

const WireframeMarker: FunctionComponent<Props> = ({ style, text }) => (
    <Text
        style={[
            {
                fontSize: 16,
                fontWeight: '600',
                marginBottom: 6,
                backgroundColor: 'grey',
                color: 'white',
                position: 'absolute',
                top: 0,
                left: 0
            },
            style
        ]}
    >
        {text || 'WIREFRAME'}
    </Text>
)

export default WireframeMarker
