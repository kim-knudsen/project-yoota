import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'
import UILibraryButton from '../../ui/ui-library/UILibraryButton'
import UILibraryColors from '../../ui/ui-library/UILibraryColors'
import UILibraryGrid from '../../ui/ui-library/UILibraryGrid'
import UILibraryGridBox from '../../ui/ui-library/UILibraryGridBox'
import UILibraryLogo from '../../ui/ui-library/UILibraryLogo'
import UILibraryText from '../../ui/ui-library/UILibraryText'
import UILibraryTextInput from '../../ui/ui-library/UILibraryTextInput'

import { ColorScheme } from '@yoota/theme'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'UILibrary'>

const UILibraryScreen: FunctionComponent<Props> = () => (
    <ScrollView style={{ backgroundColor: ColorScheme.grey.shade09 }}>
        <UILibraryLogo />
        <UILibraryButton />
        <UILibraryTextInput />
        <UILibraryGridBox />
        <UILibraryText />
        <UILibraryColors />
        <UILibraryGrid />
    </ScrollView>
)

export default UILibraryScreen
