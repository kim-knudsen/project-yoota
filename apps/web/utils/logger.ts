import { createConsoleLogger, LogLevel } from '@yoota/logger'

const level: LogLevel = (process.env.NEXT_PUBLIC_CONSOLE_LOG_LEVEL as LogLevel) ?? 'info'

export const logger = (name: string) => createConsoleLogger({ name, level })
