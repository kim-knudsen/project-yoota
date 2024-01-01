class AssertionError extends Error {
    constructor(message: string) {
        super(message)

        this.name = 'AssertionError'

        Object.setPrototypeOf(this, AssertionError.prototype)
    }
}

export function assertIsDefined<T>(value: T, messageOrError?: string | Error): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        const error =
            messageOrError instanceof Error
                ? messageOrError
                : new AssertionError(messageOrError ?? 'Value is not defined')
        throw error
    }
}

/**
 * Useful for type narrowing assertions.
 *
 * @example
 * declare const x: number | string | undefined;
 * assertTruthy(x) // number | string
 *
 * // Also usable with type guarding expressions!
 * assertTruthy(typeof x === "string"); // Narrows x to string
 */
export function assertTruthy<T>(value: T, messageOrError?: string | Error): asserts value {
    if (!value) {
        const error =
            messageOrError instanceof Error
                ? messageOrError
                : new AssertionError(messageOrError ?? 'Not a truthy value')
        throw error
    }
}
