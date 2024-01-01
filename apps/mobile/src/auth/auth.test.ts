import { describe, expect, it } from '@jest/globals'
import { clearAccessToken, getAccessToken, storeAccessToken } from './auth'

const TOKEN = '123'

describe('Storing access token', () => {
    it('should store access token', async () => {
        await storeAccessToken(TOKEN)
        const storedToken = await getAccessToken()
        expect(TOKEN).toEqual(storedToken)
    })
    it('should clear access token', async () => {
        await storeAccessToken(TOKEN)
        const storedToken = await getAccessToken()
        expect(TOKEN).toEqual(storedToken)
        await clearAccessToken()
        const clearedToken = await getAccessToken()
        expect(clearedToken).toEqual(null)
    })
})
