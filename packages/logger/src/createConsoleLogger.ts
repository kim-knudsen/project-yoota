import { AnyLoggerParameter, LoggerCreator, LoggerOptions, LogLevel, LogMethod, valueFromLogLevel } from './logger'

export const createConsoleLogger: LoggerCreator = (options: LoggerOptions) => {
    const name = typeof options === 'string' ? options : options.name
    const level: LogLevel = typeof options === 'string' ? 'info' : options.level ?? 'info'

    const print = (
        message: AnyLoggerParameter,
        rest: AnyLoggerParameter[],
        printer: LogMethod,
        printLevel: LogLevel
    ) => {
        const levelValue = valueFromLogLevel(level)
        const printLevelValue = valueFromLogLevel(printLevel)

        if (printLevelValue >= levelValue) printer(`${name} [${printLevel}] \u27A1`, message, ...rest)
    }

    return {
        log: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.log, 'info')
        },
        info: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.log, 'info')
        },
        analytics: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.log, 'info')
        },
        debug: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.log, 'debug')
        },
        warn: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.warn, 'warn')
        },
        error: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) => {
            print(message, optionalParams, console.error, 'error')
        }
    }
}
