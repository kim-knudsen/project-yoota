import React, { FunctionComponent, useState } from 'react'
import TextInputField from '../components/TextInputField'
import UISection from './UILibrarySection'

const UILibraryTextInput: FunctionComponent = () => {
    const [textInput1, setTextInput1] = useState<string>('')
    const [textInput2, setTextInput2] = useState<string>('')

    return (
        <>
            <UISection title="TextInput">
                <TextInputField
                    label={'Name'}
                    value={textInput1}
                    onChangeText={setTextInput1}
                    placeholder="Type you name"
                />

                <TextInputField
                    label={'Validation'}
                    value={textInput2}
                    onChangeText={setTextInput2}
                    placeholder="Type nothing"
                    note="Input is not allowed"
                    error={textInput2.length > 0 ? 'Sorry but no input is valid' : undefined}
                />
            </UISection>
        </>
    )
}

export default UILibraryTextInput
