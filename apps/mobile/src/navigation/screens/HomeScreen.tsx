import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useTranslations } from '@yoota/i18n'
import React, { FC } from 'react'
import { Button, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useSignOut } from '../../auth/useSignOut'
import { useSetLocale } from '../../hooks/localeHooks'
import { useMe } from '../../hooks/useMe'
import BoxTouch from '../../ui/components/BoxTouch'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const LOGO_SIZE = 70

const HomeScreen: FC<Props> = ({ navigation }) => {
    const { me } = useMe()
    const { data: myEventsData } = trpc.event.organizing.useQuery(undefined, { enabled: !!me })
    const signOut = useSignOut()
    const { createEvent, myEvents, signInButtonLabel, signOutButtonLabel, welcome } = useTranslations('dashboard')
    const setLocale = useSetLocale()
    const hasEvents = myEventsData && myEventsData.length > 0

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: LOGO_SIZE,
                        height: LOGO_SIZE,
                        justifyContent: 'center',
                        paddingHorizontal: 5
                    }}
                >
                    <Text numberOfLines={2} style={{ fontSize: 24, textAlign: 'center', fontWeight: '700' }}>
                        YOOTA
                    </Text>
                </View>
                <View style={{ flex: 1 }} />
                <View style={{ paddingRight: 15 }}>
                    {me ? (
                        <TouchableOpacity onPress={signOut}>
                            <Text style={{ letterSpacing: 1, color: 'grey' }}>{signOutButtonLabel}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} testID="loginButton">
                            <Text style={{ letterSpacing: 1 }}>{signInButtonLabel}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{ paddingHorizontal: 40, paddingBottom: 40 }}>
                {me && (
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, letterSpacing: 1, paddingBottom: 5 }}>{welcome}</Text>
                        <Text style={{ fontSize: 20, letterSpacing: 1 }}>{me.name}</Text>
                    </View>
                )}

                <View style={{ paddingTop: 30 }}>
                    <BoxTouch style={{ paddingHorizontal: 30 }} onPress={() => navigation.navigate('CreateEvent')}>
                        <Text style={{ fontSize: 16, letterSpacing: 1, textAlign: 'center' }}>
                            {createEvent.toUpperCase()}
                        </Text>
                    </BoxTouch>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {!!me && hasEvents && (
                    <>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                paddingBottom: 10,
                                borderBottomColor: '#ccc',
                                borderBottomWidth: 1
                            }}
                        >
                            <Text style={{ fontSize: 12, letterSpacing: 1, textAlign: 'center' }}>
                                {myEvents.toUpperCase()}
                            </Text>
                        </View>
                        <FlatList
                            data={myEventsData}
                            contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
                            renderItem={({ item: event, index }) => (
                                <View key={index} style={{ borderRadius: 15, paddingTop: 20, marginBottom: 10 }}>
                                    <View style={{ paddingHorizontal: 20 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{event.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                                        <Button
                                            title="Invitation"
                                            onPress={() => navigation.navigate('EventInvite', { eventId: event.id })}
                                        />

                                        <Button
                                            title="Participant"
                                            onPress={() => navigation.navigate('Participate', { eventId: event.id })}
                                        />
                                    </View>
                                </View>
                            )}
                        />
                    </>
                )}
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    borderTopColor: '#ccc',
                    borderTopWidth: 1
                }}
            >
                <Button title="🇩🇰" onPress={() => setLocale('da')} />
                <Button title="🇺🇸" onPress={() => setLocale('en-US')} />
                <Button title="UILibrary" onPress={() => navigation.navigate('UILibrary')} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen
