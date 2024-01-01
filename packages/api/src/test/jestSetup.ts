import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
// Order matters
import { prisma } from '@yoota/db'

jest.mock('@yoota/db', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
    eventSelectValidator: jest.fn
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})
