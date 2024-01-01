import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import Label from '../components/Label'
import Text, { FontSize, FontWeight } from '../components/Text'
import { grid } from '../utils/layout'
import UISection from './UILibrarySection'

const UILibraryText: FunctionComponent = () => (
    <>
        <UISection title="Font Weight">
            <FontStyleWeight text="Dolore excepteur ea duis sunt" weight="thin" />
            <FontStyleWeight text="Dolore excepteur ea duis sunt" weight="light" />
            <FontStyleWeight text="Dolore excepteur ea duis sunt" weight="regular" />
            <FontStyleWeight text="Dolore excepteur ea duis sunt" weight="bold" />
            <FontStyleWeight text="Dolore excepteur ea duis sunt" weight="black" />
        </UISection>
        <UISection title="Font Size">
            <FontStyleSize text="Dolore excepteur ea duis sunt" size={12} />
            <FontStyleSize text="Dolore excepteur ea duis sunt" size={16} />
            <FontStyleSize text="Dolore excepteur ea duis sunt" size={20} />
        </UISection>
        <UISection title="Label">
            <Label text={'Dolore excepteur ea duis sunt'} />
        </UISection>
    </>
)

export default UILibraryText

interface FontStyleSizeProps {
    text: string
    size: FontSize
}

const FontStyleSize: FunctionComponent<FontStyleSizeProps> = ({ text, size }) => (
    <View style={{ marginVertical: grid.small }}>
        <Label text={`Size: ${size}`} />
        <Text text={text} size={size} weight="regular" />
    </View>
)

interface FontStyleWeightProps {
    text: string
    weight: FontWeight
}

const FontStyleWeight: FunctionComponent<FontStyleWeightProps> = ({ text, weight }) => (
    <View style={{ marginVertical: grid.small }}>
        <Label text={`Weight: ${weight}`} />
        <Text text={text} weight={weight} size={20} />
    </View>
)
