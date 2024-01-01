import { createConsoleLogger, LogLevel } from '@yoota/logger'

// TODO: Set this based on environment - should be 'silent' for prod builds
const level: LogLevel = 'debug'

export const logger = (name: string) => createConsoleLogger({ name, level })
