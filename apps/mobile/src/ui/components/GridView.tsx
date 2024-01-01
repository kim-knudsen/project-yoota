import React, { FunctionComponent } from 'react'
import { View, ViewProps } from 'react-native'
import { grid, GridSize } from '../utils/layout'

export interface GridProps {
    innerHorizontal?: GridSize
    innerVertical?: GridSize
    innerTop?: GridSize
    innerBottom?: GridSize
    innerLeft?: GridSize
    innerRight?: GridSize
    outerHorizontal?: GridSize
    outerVertical?: GridSize
    outerTop?: GridSize
    outerBottom?: GridSize
    outerLeft?: GridSize
    outerRight?: GridSize
}

export type GridViewProps = ViewProps & GridProps

const GridView: FunctionComponent<GridViewProps> = ({
    innerHorizontal,
    innerVertical,
    innerTop,
    innerBottom,
    innerLeft,
    innerRight,
    outerHorizontal,
    outerVertical,
    outerTop,
    outerBottom,
    outerLeft,
    outerRight,
    style,
    ...props
}) => (
    <View
        {...props}
        style={[
            {
                ...(innerHorizontal && { paddingHorizontal: grid[innerHorizontal] }),
                ...(innerVertical && { paddingVertical: grid[innerVertical] }),
                ...(innerTop && { paddingTop: grid[innerTop] }),
                ...(innerBottom && { paddingBottom: grid[innerBottom] }),
                ...(innerLeft && { paddingLeft: grid[innerLeft] }),
                ...(innerRight && { paddingRight: grid[innerRight] }),
                ...(outerHorizontal && { marginHorizontal: grid[outerHorizontal] }),
                ...(outerVertical && { marginVertical: grid[outerVertical] }),
                ...(outerTop && { marginTop: grid[outerTop] }),
                ...(outerBottom && { marginBottom: grid[outerBottom] }),
                ...(outerLeft && { marginLeft: grid[outerLeft] }),
                ...(outerRight && { marginRight: grid[outerRight] })
            },
            style
        ]}
    />
)

export default GridView
