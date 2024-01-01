import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { grid, units } from '../utils/layout'
import { styleContants } from '../utils/styles'
import Text from './Text'

export type ButtonColor = 'blueMedium' | 'blueDark' | 'grey'

interface Props {
    title: string
    onPress: () => void
    buttonColor: ButtonColor
}

const ButtonSmall: FunctionComponent<Props> = ({ onPress, title, buttonColor }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={styleContants.activeOpacitySubtle}>
        <View
            style={{
                height: grid.large,
                backgroundColor: getButtonColors(buttonColor),
                borderRadius: styleContants.borderRadius,
                justifyContent: 'center',
                paddingHorizontal: units.unit02
            }}
        >
            <Text
                text={title}
                size={12}
                weight="regular"
                align="center"
                color={buttonColor === 'grey' ? 'dark' : 'light'}
            />
        </View>
    </TouchableOpacity>
)

export default ButtonSmall

const getButtonColors = (buttonColor: ButtonColor) => {
    switch (buttonColor) {
        case 'blueMedium':
            return ColorScheme.blue.normal
        case 'blueDark':
            return ColorScheme.blue.dark
        case 'grey':
            return ColorScheme.grey.shade08
    }
}
