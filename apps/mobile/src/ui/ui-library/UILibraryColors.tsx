import { ColorElement, ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import Text, { FontColor } from '../components/Text'
import { grid } from '../utils/layout'
import UILibrarySection from './UILibrarySection'

const UILibraryColors: FunctionComponent = () => (
    <UILibrarySection title="Colors">
        <ColorSwatch text="blue.base" backgroundColor={ColorScheme.blue.normal} color="light" />
        <ColorSwatch text="blue.dark" backgroundColor={ColorScheme.blue.dark} color="light" />
        <ColorSwatch text="grey.shade01" backgroundColor={ColorScheme.grey.shade01} color="light" />
        <ColorSwatch text="grey.shade02" backgroundColor={ColorScheme.grey.shade02} color="light" />
        <ColorSwatch text="grey.shade03" backgroundColor={ColorScheme.grey.shade03} color="light" />
        <ColorSwatch text="grey.shade04" backgroundColor={ColorScheme.grey.shade04} color="light" />
        <ColorSwatch text="grey.shade05" backgroundColor={ColorScheme.grey.shade05} color="light" />
        <ColorSwatch text="grey.shade06" backgroundColor={ColorScheme.grey.shade06} color="dark" />
        <ColorSwatch text="grey.shade07" backgroundColor={ColorScheme.grey.shade07} color="dark" />
        <ColorSwatch text="grey.shade08" backgroundColor={ColorScheme.grey.shade08} color="dark" />
        <ColorSwatch text="grey.shade09" backgroundColor={ColorScheme.grey.shade09} color="dark" />
        <ColorSwatch text="grey.shade10" backgroundColor={ColorScheme.grey.shade10} color="dark" />
    </UILibrarySection>
)

export default UILibraryColors

interface Props {
    backgroundColor: ColorElement
    color: FontColor
    text: string
}

const ColorSwatch: FunctionComponent<Props> = ({ text, backgroundColor, color }) => (
    <View style={{ backgroundColor, padding: grid.small, marginBottom: grid.small }}>
        <Text text={text} size={12} weight="regular" color={color} />
    </View>
)
