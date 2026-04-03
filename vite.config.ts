import { defineConfig, type ConfigEnv } from 'vite'
type Mode = 'production' | 'test' | 'default' 
const configs: Record<Mode, string> = {
  production: './vite.config.prod.ts',
  default: './vite.config.test.ts',
  test: './vite.config.test.ts',
}
export default defineConfig(async (env: ConfigEnv) => {
  const configPath = configs[env.mode as Mode] || configs.default
  const configModule = await import(new URL(configPath, import.meta.url).href)
  return configModule.default
})

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': '/src',
//     },
//   },
// })
