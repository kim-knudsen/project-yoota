import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import Button from '../components/Button'
import ButtonSmall from '../components/ButtonSmall'
import GridView from '../components/GridView'
import Label from '../components/Label'
import { grid } from '../utils/layout'

import UILibrarySection from './UILibrarySection'

const UILibraryButton: FunctionComponent = () => (
    <>
        <UILibrarySection title="Buttons">
            <GridView outerVertical="small">
                <Label text="Button " />
                <Button title="Get Started" onPress={() => null} buttonColor="medium" />
            </GridView>
            <GridView outerVertical="small">
                <Label text="Button " />
                <Button title="Get Started" onPress={() => null} buttonColor="dark" />
            </GridView>
            <GridView outerVertical="small">
                <Label text="ButtonSmall" />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: grid.small }}>
                        <ButtonSmall title="Secondary" onPress={() => null} buttonColor="blueMedium" />
                    </View>
                    <View style={{ marginRight: grid.small }}>
                        <ButtonSmall title="Secondary" onPress={() => null} buttonColor="blueDark" />
                    </View>
                    <View style={{ marginRight: grid.small }}>
                        <ButtonSmall title="Secondary" onPress={() => null} buttonColor="grey" />
                    </View>
                </View>
            </GridView>
        </UILibrarySection>
    </>
)

export default UILibraryButton
