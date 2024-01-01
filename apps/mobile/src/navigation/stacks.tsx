import { LinkingOptions } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Event } from '@yoota/client'
import { PRODUCTION_BASE_URL } from '@yoota/common'
import { URL_SCHEME } from '../data/constants'

export type RootStackParamList = {
    Home: undefined
    Login: undefined
    EventInvite: { eventId: Event['id'] }
    Participate: { eventId: Event['id'] }
    EventList: undefined
    CreateEvent: undefined
    MagicLink: { verificationToken: string; email: string } | { accessToken: string }
    UILibrary: undefined
}

type RootLinkingOptions = LinkingOptions<RootStackParamList>

export const RootStack = createNativeStackNavigator<RootStackParamList>()

export const MAGIC_LINK_SCREEN_PATH = '/login/email'

export const LINKING_OPTIONS: RootLinkingOptions = {
    // E.g.: ['https://www.yoota.app', 'yoota://'],
    prefixes: [PRODUCTION_BASE_URL, URL_SCHEME],
    config: {
        initialRouteName: 'Home',
        screens: {
            EventInvite: {
                path: 'e/:eventId'
            },
            MagicLink: {
                path: MAGIC_LINK_SCREEN_PATH
            }
        }
    }
}
