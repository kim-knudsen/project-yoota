import AsyncStorage from '@react-native-async-storage/async-storage'

export type AccessToken = string

export const storeAccessToken = (accessToken: AccessToken) => AsyncStorage.setItem('token', accessToken)

export const getAccessToken = () => AsyncStorage.getItem('token')

export const clearAccessToken = () => AsyncStorage.removeItem('token')
