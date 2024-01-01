import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import GridView, { GridProps } from '../components/GridView'
import Label from '../components/Label'
import Text from '../components/Text'
import { grid, GridSize } from '../utils/layout'
import UILibrarySection from './UILibrarySection'

const UILibraryGrid: FunctionComponent = () => (
    <>
        <UILibrarySection title="GridView">
            <GridView innerTop="small">
                <Text text="innerLeft" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="innerLeft" />
                <Example gridSize="small" gridViewPropKey="innerLeft" />
                <Example gridSize="medium" gridViewPropKey="innerLeft" />
                <Example gridSize="large" gridViewPropKey="innerLeft" />
                <Example gridSize="xl" gridViewPropKey="innerLeft" />
            </GridView>
            <GridView innerTop="small">
                <Text text="innerRight" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="innerRight" />
                <Example gridSize="small" gridViewPropKey="innerRight" />
                <Example gridSize="medium" gridViewPropKey="innerRight" />
                <Example gridSize="large" gridViewPropKey="innerRight" />
                <Example gridSize="xl" gridViewPropKey="innerRight" />
            </GridView>

            <GridView innerTop="small">
                <Text text="innerHorizontal" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="innerHorizontal" />
                <Example gridSize="small" gridViewPropKey="innerHorizontal" />
                <Example gridSize="medium" gridViewPropKey="innerHorizontal" />
                <Example gridSize="large" gridViewPropKey="innerHorizontal" />
                <Example gridSize="xl" gridViewPropKey="innerHorizontal" />
            </GridView>
            <GridView innerTop="small">
                <Text text="outerLeft" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="outerLeft" />
                <Example gridSize="small" gridViewPropKey="outerLeft" />
                <Example gridSize="medium" gridViewPropKey="outerLeft" />
                <Example gridSize="large" gridViewPropKey="outerLeft" />
                <Example gridSize="xl" gridViewPropKey="outerLeft" />
            </GridView>
            <GridView innerTop="small">
                <Text text="outerRight" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="outerRight" />
                <Example gridSize="small" gridViewPropKey="outerRight" />
                <Example gridSize="medium" gridViewPropKey="outerRight" />
                <Example gridSize="large" gridViewPropKey="outerRight" />
                <Example gridSize="xl" gridViewPropKey="outerRight" />
            </GridView>

            <GridView innerTop="small">
                <Text text="outerHorizontal" weight="bold" />
                <Example gridSize="xs" gridViewPropKey="outerHorizontal" />
                <Example gridSize="small" gridViewPropKey="outerHorizontal" />
                <Example gridSize="medium" gridViewPropKey="outerHorizontal" />
                <Example gridSize="large" gridViewPropKey="outerHorizontal" />
                <Example gridSize="xl" gridViewPropKey="outerHorizontal" />
            </GridView>
            <GridView innerTop="medium">
                <Text text="Includes" weight="bold" />
                <Text text="innerVertical • innerTop • innerBottom" color="grey" style={{ fontStyle: 'italic' }} />
                <Text text="outerVertical • outerTop • outerBottom" color="grey" style={{ fontStyle: 'italic' }} />
            </GridView>
        </UILibrarySection>
    </>
)

export default UILibraryGrid

interface GridViewExampleProps {
    gridSize: GridSize
    gridViewPropKey: keyof GridProps
}

const Example: FunctionComponent<GridViewExampleProps> = ({ gridViewPropKey, gridSize }) => (
    <>
        <View>
            <Label text={`${gridSize}`} />
        </View>

        <GridView
            {...{ [gridViewPropKey]: gridSize }}
            style={{
                backgroundColor: ColorScheme.grey.shade08
            }}
        >
            <View style={{ height: grid.small, backgroundColor: ColorScheme.grey.shade07 }} />
        </GridView>
    </>
)
