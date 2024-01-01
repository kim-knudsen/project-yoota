import { PrismaTimeZone } from '@yoota/db'
import { createMockedContext } from '../test/createMockedContext'
import { prismaMock } from '../test/jestSetup'
import { appRouter } from './appRouter'

const timeZones: PrismaTimeZone[] = [
    {
        id: 1,
        value: 'Dateline Standard Time',
        abbr: 'DST',
        offset: -12,
        isdst: false,
        text: '(UTC-12:00) International Date Line West',
        utc: ['Etc/GMT+12']
    },
    {
        id: 2,
        value: 'UTC-11',
        abbr: 'U',
        offset: -11,
        isdst: false,
        text: '(UTC-11:00) Coordinated Universal Time-11',
        utc: ['Etc/GMT+11', 'Pacific/Midway', 'Pacific/Niue', 'Pacific/Pago_Pago']
    },
    {
        id: 3,
        value: 'Hawaiian Standard Time',
        abbr: 'HST',
        offset: -10,
        isdst: false,
        text: '(UTC-10:00) Hawaii',
        utc: ['Etc/GMT+10', 'Pacific/Honolulu', 'Pacific/Johnston', 'Pacific/Rarotonga', 'Pacific/Tahiti']
    }
]

beforeEach(() => {
    prismaMock.timeZone.findMany.mockResolvedValue(timeZones)
})

test('get time zones', async () => {
    const caller = appRouter.createCaller(createMockedContext())
    const timeZones = await caller.timeZone.all()

    expect(timeZones.length).toEqual(3)
})
