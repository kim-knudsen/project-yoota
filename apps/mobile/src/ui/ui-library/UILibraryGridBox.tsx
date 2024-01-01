import React, { FunctionComponent } from 'react'
import GridBox from '../components/GridBox'
import GridView from '../components/GridView'
import Label from '../components/Label'
import Text from '../components/Text'
import UILibrarySection from './UILibrarySection'

const UILibraryGridBox: FunctionComponent = () => (
    <>
        <UILibrarySection title="GridBox">
            <GridView outerBottom="medium">
                <Label text="boxColor" />
                <GridBox innerHorizontal="medium" innerVertical="large" outerVertical="small" boxColor="white">
                    <Text text="White / Shadow" />
                </GridBox>
                <GridBox
                    innerHorizontal="medium"
                    innerVertical="large"
                    outerVertical="small"
                    boxColor="grey"
                    shadow={false}
                >
                    <Text text="Grey" />
                </GridBox>
                <GridBox
                    innerHorizontal="medium"
                    innerVertical="large"
                    outerVertical="small"
                    boxColor="blue"
                    shadow={false}
                >
                    <Text text="Blue " color="light" />
                </GridBox>
            </GridView>
            <GridView outerBottom="medium">
                <Label text="Grid props" />
                <GridBox innerHorizontal="small" innerVertical="xs" outerVertical="xs" boxColor="white">
                    <Text text="innerVertical: xs" align="center" />
                </GridBox>
                <GridBox innerHorizontal="small" innerVertical="small" outerVertical="xs" boxColor="white">
                    <Text text="innerVertical: small" align="center" />
                </GridBox>
                <GridBox innerHorizontal="small" innerVertical="medium" outerVertical="xs" boxColor="white">
                    <Text text="innerVertical: medium" align="center" />
                </GridBox>
                <GridBox innerHorizontal="small" innerVertical="large" outerVertical="xs" boxColor="white">
                    <Text text="innerVertical: large" align="center" />
                </GridBox>
                <GridBox innerHorizontal="small" innerVertical="xl" outerVertical="xs" boxColor="white">
                    <Text text="innerVertical: xl" align="center" />
                </GridBox>
            </GridView>
        </UILibrarySection>
    </>
)

export default UILibraryGridBox
