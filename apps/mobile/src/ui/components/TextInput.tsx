import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import { TextInput as Input, TextInputProps } from 'react-native'
import { grid } from '../utils/layout'
import { styleContants } from '../utils/styles'

const TextInput: FunctionComponent<TextInputProps> = props => (
    <Input
        style={[
            {
                height: grid.xl,
                paddingHorizontal: grid.small,
                backgroundColor: ColorScheme.grey.shade10,
                borderRadius: styleContants.borderRadius,
                borderColor: ColorScheme.grey.shade07,
                borderWidth: 1
            }
        ]}
        {...props}
    />
)

export default TextInput
