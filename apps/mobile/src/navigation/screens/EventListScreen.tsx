import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { FC } from 'react'
import { Button, FlatList, Text, View } from 'react-native'
import { trpc } from '../../utils/trpc'
import { RootStackParamList } from '../stacks'

type Props = NativeStackScreenProps<RootStackParamList, 'EventList'>

const EventListScreen: FC<Props> = ({ navigation }) => {
    const { data: events } = trpc.event.organizing.useQuery()
    return (
        <FlatList
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 20 }}
            data={events}
            renderItem={({ item }) => (
                <View style={{ backgroundColor: 'white', borderRadius: 15, paddingTop: 20, marginBottom: 10 }}>
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ color: 'grey', fontSize: 11, letterSpacing: 1 }}>{item.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                        <Button
                            title="Invitation"
                            onPress={() => navigation.navigate('EventInvite', { eventId: item.id })}
                        />

                        <Button
                            title="Participant"
                            onPress={() => navigation.navigate('Participate', { eventId: item.id })}
                        />
                    </View>
                </View>
            )}
        />
    )
}

export default EventListScreen
