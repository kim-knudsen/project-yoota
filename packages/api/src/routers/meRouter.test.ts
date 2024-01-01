import { TRPCError } from '@trpc/server'
import { createMockedContext, mockedUser } from '../test/createMockedContext'
import { appRouter } from './appRouter'

test('get current logged in user', async () => {
    const caller = appRouter.createCaller(createMockedContext())
    const me = await caller.me()

    expect(me).toEqual(mockedUser)
})

test('expect 401 if not logged in', async () => {
    const context = createMockedContext()
    const caller = appRouter.createCaller({ ...context, session: null })

    await expect(caller.me()).rejects.toEqual(new TRPCError({ code: 'UNAUTHORIZED' }))
})
