import { mock } from 'jest-mock-extended'
import { NextApiRequest, NextApiResponse } from 'next'
import type { Context } from '../routers/createContext'
import { prismaMock } from './jestSetup'

export const mockedUser = {
    email: 'john@doe.com',
    name: 'John'
}

export const createMockedContext = (): Context => ({
    prisma: prismaMock,
    session: {
        expires: 'foo',
        token: 'bar',
        user: mockedUser
    },
    req: mock<NextApiRequest>(),
    res: mock<NextApiResponse>()
})
