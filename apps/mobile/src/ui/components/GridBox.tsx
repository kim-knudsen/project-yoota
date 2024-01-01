import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent, ReactNode } from 'react'
import { styleContants, styles } from '../utils/styles'
import GridView, { GridProps } from './GridView'

export type BoxColor = 'blue' | 'white' | 'grey'

interface Props extends GridProps {
    children: ReactNode
    boxColor?: BoxColor
    shadow?: boolean
}

const GridBox: FunctionComponent<Props> = ({ children, boxColor = 'white', shadow = true, ...gridProps }) => (
    <GridView
        style={[
            { backgroundColor: getBackgroundColor(boxColor), borderRadius: styleContants.borderRadius },
            shadow && styles.shadow01
        ]}
        {...gridProps}
    >
        {children}
    </GridView>
)

export default GridBox

const getBackgroundColor = (buttonColor: BoxColor) => {
    switch (buttonColor) {
        case 'blue':
            return ColorScheme.blue.normal
        case 'white':
            return ColorScheme.grey.shade10
        case 'grey':
            return ColorScheme.grey.shade08
    }
}
