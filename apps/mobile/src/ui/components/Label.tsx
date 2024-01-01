import React, { FunctionComponent } from 'react'
import Text, { FontColor } from './Text'

type LabelColors = Extract<FontColor, 'light' | 'grey'>

interface Props {
    text: string
    color?: LabelColors
}

const Label: FunctionComponent<Props> = ({ text, color = 'grey' }) => (
    <Text text={text} size={12} color={color} style={{ marginBottom: 4 }} />
)

export default Label
