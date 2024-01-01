import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import CreateEventScreen from './navigation/screens/CreateEventScreen'
import EventInviteScreen from './navigation/screens/EventInviteScreen'
import EventListScreen from './navigation/screens/EventListScreen'
import HomeScreen from './navigation/screens/HomeScreen'
import LoginScreen from './navigation/screens/LoginScreen'
import MagicLinkScreen from './navigation/screens/MagicLinkScreen'
import ParticipateScreen from './navigation/screens/ParticipateScreen'
import UILibraryScreen from './navigation/screens/UILibraryScreen'
import { LINKING_OPTIONS, RootStack } from './navigation/stacks'
import { BootProvider } from './providers/BootProvider'
import TrpcProvider from './providers/TrpcProvider'
import FullscreenModalHeader from './ui/components/FullscreenModalHeader'

const App = () => (
    <TrpcProvider>
        <BootProvider>
            <NavigationContainer linking={LINKING_OPTIONS} fallback={<Text>Loading...</Text>}>
                <RootStack.Navigator initialRouteName="Home">
                    <RootStack.Group>
                        <RootStack.Screen name="Home" component={HomeScreen} options={{ header: () => null }} />
                        <RootStack.Screen name="Login" component={LoginScreen} />
                        <RootStack.Screen name="EventList" component={EventListScreen} />
                    </RootStack.Group>
                    <RootStack.Group
                        screenOptions={{
                            presentation: 'fullScreenModal',
                            // eslint-disable-next-line react/no-unstable-nested-components
                            header: props => <FullscreenModalHeader {...props} />
                        }}
                    >
                        <RootStack.Screen name="EventInvite" component={EventInviteScreen} />
                        <RootStack.Screen name="Participate" component={ParticipateScreen} />
                        <RootStack.Screen name="CreateEvent" component={CreateEventScreen} />
                        <RootStack.Screen name="MagicLink" component={MagicLinkScreen} />
                    </RootStack.Group>
                    <RootStack.Group>
                        <RootStack.Screen name="UILibrary" component={UILibraryScreen} />
                    </RootStack.Group>
                </RootStack.Navigator>
            </NavigationContainer>
        </BootProvider>
    </TrpcProvider>
)

export default App
