import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { ColorScheme } from '@yoota/theme'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Text from './Text'

export const HEADER_HEIGHT = 55
export const SCENE_BORDER_RADIUS = 16

const NavHeader = (props: NativeStackHeaderProps) => {
    const { top } = useSafeAreaInsets()
    return (
        <>
            <View
                style={{
                    paddingBottom: 24,
                    paddingTop: top + 10,
                    flexDirection: 'row',
                    backgroundColor: ColorScheme.blue.normal,
                    height: top + HEADER_HEIGHT
                }}
            >
                <View style={{ width: 60, justifyContent: 'center' }}>
                    {props.options.headerLeft && props.options.headerLeft({ canGoBack: false })}
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text text={props.options.title} size={16} color="light" align="center" />
                </View>
                <View style={{ width: 60, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={() => props.navigation.pop()}
                        style={{ paddingRight: 24 }}
                        hitSlop={{ bottom: 20, left: 20, right: 20, top: 20 }}
                    >
                        <FontAwesomeIcon icon={faXmark} color={ColorScheme.white.normal} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default NavHeader
