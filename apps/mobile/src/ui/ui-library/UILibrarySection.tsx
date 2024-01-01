import React, { FunctionComponent, ReactNode } from 'react'
import { View } from 'react-native'
import GridView from '../components/GridView'
import Text from '../components/Text'
import { grid } from '../utils/layout'

interface Props {
    title: string
    children: ReactNode
}

const UILibrarySection: FunctionComponent<Props> = ({ title, children }) => (
    <GridView innerHorizontal="medium" innerVertical="medium">
        <Text text={title} size={16} weight="regular" style={{ marginBottom: grid.small }} />
        <View>{children}</View>
    </GridView>
)

export default UILibrarySection
