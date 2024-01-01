export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'analytics' | 'debug' | 'trace' | 'silent'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyLoggerParameter = any

export type LogMethod = (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => void | Promise<void>

export interface Logger {
    log: LogMethod
    info: LogMethod
    analytics: LogMethod
    debug: LogMethod
    warn: LogMethod
    error: LogMethod
}

export type LoggerOptions =
    | {
          name: string
          level?: LogLevel
      }
    | string

export type LoggerCreator = (options: LoggerOptions) => Logger

const logLevelMap = new Map<LogLevel, number>([
    ['trace', 10],
    ['debug', 20],
    ['info', 30],
    ['analytics', 35],
    ['warn', 40],
    ['error', 50],
    ['fatal', 60],
    ['silent', Infinity]
])

export const valueFromLogLevel = (logLevel: LogLevel) => logLevelMap.get(logLevel) ?? 30
