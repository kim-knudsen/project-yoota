module.exports = {
    root: true,
    extends: ['@yoota/eslint-config/base', 'next'],
    rules: {
        '@next/next/no-html-link-for-pages': 'off',
        'react/jsx-key': 'off'
    }
}
