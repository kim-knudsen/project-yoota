import { AnyLoggerParameter, LoggerCreator, LoggerOptions, LogLevel, valueFromLogLevel } from '@yoota/logger'
import { err as serializeError } from 'pino-std-serializers'

export const createPersistentLogger: LoggerCreator = (options: LoggerOptions) => {
    const name = typeof options === 'string' ? options : options.name
    const level: LogLevel = typeof options === 'string' ? 'info' : options.level ?? 'info'

    const print = async (message: AnyLoggerParameter, rest: AnyLoggerParameter[], printLevel: LogLevel) => {
        const levelValue = valueFromLogLevel(level)
        const printLevelValue = valueFromLogLevel(printLevel)

        if (printLevelValue >= levelValue) {
            const [restInput] = rest
            const payload = { ...serializeInput(message), ...serializeInput(restInput) }
            const { prisma } = await import('@yoota/db')

            // Log to the console as well
            console.log({ name, level }, payload)

            await prisma.log.create({ data: { name, level: printLevelValue, payload } })
        }
    }

    return {
        log: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'info'),
        info: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'info'),
        analytics: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'analytics'),
        debug: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'debug'),
        warn: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'warn'),
        error: (message?: AnyLoggerParameter, ...optionalParams: AnyLoggerParameter[]) =>
            print(message, optionalParams, 'error')
    }
}

const serializeInput = (input: AnyLoggerParameter) => {
    if (typeof input === 'string') {
        return { msg: input }
    }
    if (input instanceof Error) {
        const error = serializeError(input)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { raw, ...rest } = error
        return { ...rest }
    }
    if (isPlainObject(input)) {
        return input
    }
    return {}
}

const isPlainObject = (value: AnyLoggerParameter) => {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const prototype = Object.getPrototypeOf(value)
    return (
        (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) &&
        !(Symbol.toStringTag in value) &&
        !(Symbol.iterator in value)
    )
}
