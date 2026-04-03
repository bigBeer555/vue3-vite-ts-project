import { defineConfig, type ConfigEnv, type UserConfig } from 'vite'
import prodConfig from './vite.config.prod'
import testConfig from './vite.config.test'

type Mode = 'production' | 'test' | 'default'
const configs: Record<Mode, UserConfig> = {
  production: prodConfig,
  default: testConfig,
  test: testConfig,
}

export default defineConfig((env: ConfigEnv) => {
  return configs[env.mode as Mode] || configs.default
})

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// })
