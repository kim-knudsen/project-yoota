import type { Config } from 'jest'

const config: Config = {
    rootDir: '../',
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/test/jestSetup.ts']
}

export default config
