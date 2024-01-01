import { ColorScheme } from '@yoota/theme'
import { StyleSheet, ViewStyle } from 'react-native'
import { units } from './layout'

export const styleContants = {
    borderRadius: units.unit01,
    activeOpacitySubtle: 0.8
}

interface Styles {
    shadow01: ViewStyle
}

export const styles = StyleSheet.create<Styles>({
    shadow01: {
        shadowColor: ColorScheme.grey.shade01,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.12,
        shadowRadius: 2
    }
})
