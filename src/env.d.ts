/// <reference types="vite/client" />

declare interface Dialog {
  type: import('./hooks/dialog').DialogType;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

