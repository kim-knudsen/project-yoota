import type { Config } from 'jest'

const config: Config = {
    preset: '@rnx-kit/jest-preset',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    rootDir: '../../src',
    setupFiles: ['../jest/unit/setup.ts']
}

export default config
