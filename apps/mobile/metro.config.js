// metro.config.js
const { assetExts, sourceExts } = require('metro-config/src/defaults/defaults')
const { makeMetroConfig } = require('@rnx-kit/metro-config')

module.exports = makeMetroConfig({
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        }),
        babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg']
    }
})
