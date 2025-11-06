import { defineConfig, type ConfigEnv } from 'vite'
type Mode = 'production' | 'test' | 'default' 
const configs: Record<Mode, string> = {
  production: './vite.config.prod.ts',
  default: './vite.config.test.ts',
  test: './vite.config.test.ts',
}
export default defineConfig((env: ConfigEnv) => {
  return import(configs[env.mode as Mode] || configs.default)
})

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// })
