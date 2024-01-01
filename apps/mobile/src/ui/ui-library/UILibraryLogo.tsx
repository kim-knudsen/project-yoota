import { YootaLogo } from '@yoota/client'
import { ColorScheme } from '@yoota/theme'
import React, { FunctionComponent } from 'react'
import GridView from '../components/GridView'
import Label from '../components/Label'
import UILibrarySection from './UILibrarySection'

const UILibraryLogo: FunctionComponent = () => (
    <>
        <UILibrarySection title="Logo (Temporary)">
            <Label text="Colors" />
            <GridView style={{ flexDirection: 'row' }} outerBottom="large">
                <GridView
                    innerVertical="small"
                    innerHorizontal="small"
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: ColorScheme.grey.shade06
                    }}
                >
                    <YootaLogo color="blue" size={68} />
                </GridView>
                <GridView
                    innerVertical="small"
                    innerHorizontal="small"
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: ColorScheme.grey.shade06
                    }}
                >
                    <YootaLogo color="grey" size={68} />
                </GridView>
                <GridView
                    innerVertical="small"
                    innerHorizontal="small"
                    style={{ flex: 1, backgroundColor: ColorScheme.blue.normal, alignItems: 'center' }}
                >
                    <YootaLogo color="white" size={68} />
                </GridView>
            </GridView>

            <GridView style={{ flexDirection: 'row' }}>
                <GridView style={{ flex: 1 }}>
                    <Label text="Sizes" />
                    <YootaLogo color="blue" size={46} />
                    <YootaLogo color="blue" size={68} />
                    <YootaLogo color="blue" size={112} />
                </GridView>
            </GridView>
        </UILibrarySection>
    </>
)

export default UILibraryLogo
