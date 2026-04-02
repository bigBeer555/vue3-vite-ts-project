import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3002, // 改为 3002，避开后端服务端口
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    },
  },
})
