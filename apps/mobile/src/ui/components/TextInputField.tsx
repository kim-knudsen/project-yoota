import React, { FunctionComponent } from 'react'
import { TextInputProps, View } from 'react-native'
import { units } from '../utils/layout'
import GridView from './GridView'
import Label from './Label'
import Text, { FontColor } from './Text'
import TextInput from './TextInput'

interface Props extends TextInputProps {
    label: string
    error?: string | undefined
    note?: string
}

const TextInputField: FunctionComponent<Props> = ({ label, note, error, ...props }) => {
    const showFooterText = error || note
    const footerText = error || note
    const color: FontColor = error ? 'red' : 'grey'
    return (
        <GridView>
            <Label text={label} />
            <TextInput {...props} />
            <View style={{ marginTop: units.unit01, height: units.unit04 }}>
                {showFooterText && <Text text={footerText} color={color} />}
            </View>
        </GridView>
    )
}
export default TextInputField
