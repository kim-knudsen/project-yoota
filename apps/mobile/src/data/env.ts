import Config from 'react-native-config'
import { LaunchArguments } from 'react-native-launch-arguments'
import { logger } from '../utils/logger'
export interface LaunchArguments {
    mockUser?: string
    baseUrl?: string
}

const log = logger('env')

export const getLaunchArguments = () => LaunchArguments.value<LaunchArguments>()

// This allows Detox to override the base URL
const { baseUrl } = getLaunchArguments()

log.debug('LaunchArguments baseUrl', baseUrl)

export const BASE_URL = baseUrl ?? (Config.BASE_URL as string)

log.debug('Using base URL', BASE_URL)
