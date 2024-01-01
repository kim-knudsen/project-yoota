import type { Config } from 'jest'

const config: Config = {
    rootDir: '..',
    testMatch: ['<rootDir>/e2e/**/*.test.ts'],
    testTimeout: 120000,
    maxWorkers: 1,
    globalSetup: 'detox/runners/jest/globalSetup',
    globalTeardown: 'detox/runners/jest/globalTeardown',
    reporters: ['detox/runners/jest/reporter'],
    testEnvironment: 'detox/runners/jest/testEnvironment',
    verbose: true,
    preset: 'ts-jest'
}

export default config
