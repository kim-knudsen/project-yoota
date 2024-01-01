module.exports = {
    root: true,
    // This tells ESLint to load the config from the package `@yoota/eslint-config`
    extends: ['@yoota/eslint-config'],
    settings: {
        next: {
            rootDir: ['apps/*/']
        }
    }
}
