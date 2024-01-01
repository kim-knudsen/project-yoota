import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LocaleOrLanguage } from '@yoota/i18n'
import { useCallback } from 'react'

const ASYNC_STORAGE_LOCALE_KEY = 'async-storage-locale'

export const useSetLocale = () => {
    const queryClient = useQueryClient()

    return useCallback(
        async (locale: LocaleOrLanguage) => {
            await AsyncStorage.setItem(ASYNC_STORAGE_LOCALE_KEY, locale)
            queryClient.invalidateQueries([ASYNC_STORAGE_LOCALE_KEY])
        },
        [queryClient]
    )
}

export const useUserLocale = () =>
    useQuery([ASYNC_STORAGE_LOCALE_KEY], () => AsyncStorage.getItem(ASYNC_STORAGE_LOCALE_KEY))
