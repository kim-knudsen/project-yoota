import { device, expect, waitFor } from 'detox'
import { LaunchArguments } from '../../src/data/env'

describe('Log in as mocked user', () => {
    beforeAll(async () => {
        const launchArgs: LaunchArguments = await device.appLaunchArgs.get()

        console.log('Starting test with launchArgs', launchArgs)

        const mockUser = launchArgs.mockUser ?? 'john'

        await device.launchApp({
            launchArgs: {
                mockUser
            }
        })
    })

    it(`should log in as and tap the first event`, async () => {
        await expect(element(by.id('loginButton'))).toBeVisible()
        await element(by.id('loginButton')).tap()
        await expect(element(by.id('fakeOauthButton'))).toBeVisible()
        await element(by.id('fakeOauthButton')).tap()
        await waitFor(element(by.id('myEventListItem-0')))
            .toBeVisible()
            .withTimeout(10000)
        await element(by.id('myEventListItem-0')).tap()
    })
})
