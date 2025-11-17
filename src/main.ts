import { createApp,defineAsyncComponent } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { i18n } from './i18n'
import { registerBatch } from './hooks/dialog';
import { DialogType } from '@/hooks/dialog'

const Alert = defineAsyncComponent(() => import("@/components/Alert/index.vue"));

registerBatch({
  [DialogType.Alert]: Alert
});

const app = createApp(App)
const pinia = createPinia()
// Dialog.install('Canvas')
app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')