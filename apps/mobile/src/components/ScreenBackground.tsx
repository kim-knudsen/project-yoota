import { useNavigation } from '@react-navigation/native'
import { ColorScheme } from '@yoota/theme'
import React, { FC, ReactNode, useLayoutEffect } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
    children: ReactNode
    backgroundColor?: string
    navHeader?: boolean
    screenTitle?: string
}

const ScreenBackground: FC<Props> = ({
    backgroundColor = ColorScheme.white.normal,
    navHeader = true,
    screenTitle,
    children
}) => {
    const { top } = useSafeAreaInsets()
    const navigation = useNavigation()

    useLayoutEffect(() => {
        if (screenTitle) {
            navigation.setOptions({ title: screenTitle })
        }
    }, [navigation, screenTitle])

    return (
        <>
            {navHeader && (
                <View
                    style={{
                        height: 16,
                        backgroundColor: ColorScheme.blue.normal,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0
                    }}
                />
            )}
            <View
                style={{
                    flex: 1,
                    backgroundColor,
                    borderTopLeftRadius: navHeader ? 16 : 0,
                    borderTopRightRadius: navHeader ? 16 : 0,
                    paddingTop: navHeader ? 0 : top,
                    zIndex: 1
                }}
            >
                {children}
            </View>
        </>
    )
}

export default ScreenBackground
