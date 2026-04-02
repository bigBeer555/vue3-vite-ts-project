/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Dialog {
  type: import('./hooks/dialog').DialogType;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
