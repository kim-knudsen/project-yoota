import { ColorScheme } from '@yoota/theme'
import { toUpper } from 'rambda'
import React, { FunctionComponent } from 'react'
import { Text as RText, StyleProp, TextStyle } from 'react-native'

export type FontWeight = 'thin' | 'light' | 'regular' | 'bold' | 'black'
export type FontColor = 'dark' | 'grey' | 'light' | 'blue' | 'red'
export type FontSize = 12 | 16 | 20 | 22

interface Props {
    text: string | undefined
    weight?: FontWeight
    size?: FontSize
    style?: StyleProp<TextStyle>
    color?: FontColor
    uppercase?: boolean
    align?: TextStyle['textAlign']
}

const Text: FunctionComponent<Props> = ({
    text,
    weight = 'regular',
    size = 12,
    color = 'dark',
    uppercase,
    align,
    style
}) => (
    <RText
        style={[
            { fontFamily: getFontFamily(weight), fontSize: size, color: getFontColor(color), textAlign: align },
            style
        ]}
    >
        {uppercase && text ? toUpper(text) : text}
    </RText>
)

export default Text

const getFontFamily = (weight: FontWeight) => {
    switch (weight) {
        case 'thin':
            return 'NotoSansJP-Thin'
        case 'light':
            return 'NotoSansJP-Light'
        case 'bold':
            return 'NotoSansJP-Bold'
        case 'black':
            return 'NotoSansJP-Black'
        case 'regular':
            return 'NotoSansJP-Regular'
    }
}

export const getFontColor = (color: FontColor) => {
    switch (color) {
        case 'dark':
            return ColorScheme.grey.shade01
        case 'grey':
            return ColorScheme.grey.shade05
        case 'light':
            return ColorScheme.grey.shade10
        case 'blue':
            return ColorScheme.blue.dark
        case 'red':
            return ColorScheme.red.normal
    }
}
