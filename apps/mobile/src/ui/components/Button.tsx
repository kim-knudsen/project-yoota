import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import { grid } from '../utils/layout'
import { styleContants } from '../utils/styles'
import Text, { getFontColor } from './Text'

export type ButtonColor = 'medium' | 'dark'

interface Props extends TouchableOpacityProps {
    title: string
    onPress: () => void
    buttonColor?: ButtonColor
    icon?: IconProp
}

const Button: FunctionComponent<Props> = ({ onPress, title, buttonColor = 'medium', disabled, icon, ...rest }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={styleContants.activeOpacitySubtle} {...rest}>
        <View
            style={{
                opacity: disabled ? 0.4 : 1,
                height: grid.xl,
                backgroundColor: getButtonColors(buttonColor),
                borderRadius: styleContants.borderRadius,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            }}
        >
            <Text text={title} size={16} weight="bold" align="center" color="light" />
            {icon && <FontAwesomeIcon icon={icon} size={16} style={{ marginLeft: 8 }} color={getFontColor('light')} />}
        </View>
    </TouchableOpacity>
)

export default Button

const getButtonColors = (buttonColor: ButtonColor) => {
    switch (buttonColor) {
        case 'medium':
            return ColorScheme.blue.normal
        case 'dark':
            return ColorScheme.blue.dark
    }
}
