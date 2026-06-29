import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
export default defineConfig(async (merge) => {
  const base: UserConfigExport = {
    projectName: 'mini-scaffold', designWidth() { return 750 },
    deviceRatio: { 640: 2.34/2, 750: 1, 375: 2, 828: 1.81/2 },
    sourceRoot: 'src', outputRoot: 'dist', plugins: [], framework: 'react', compiler: 'webpack5',
    mini: {
      postcss: { pxtransform: { enable: true, config: {} }, url: { enable: true, config: { limit: 1024 } }, cssModules: { enable: false, config: { namingPattern: 'module', generateScopedName: '[name]__[local]___[hash:base64:5]' } } },
      miniCssExtractPluginOption: { ignoreOrder: true },
      webpackChain(chain) { chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin) }
    }
  }
  return process.env.NODE_ENV === 'development' ? merge({}, base, devConfig) : merge({}, base, prodConfig)
})
