import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  const locales:Record<string,any> = import.meta.glob('./lang/*/*.json', { eager: true })
  const messages: Record<string, any> = {}
  for (const path in locales) {
    const matched = path.match(/lang\/(.*)\/(.*)\.json$/)
    if (matched && matched.length === 3) {
      const locale = matched[1] as string
      const filename = matched[2] as string
      messages[locale] = messages[locale] || {}
      messages[locale][filename.replace('.json', '')] = locales[path].default
    }
  }
  return messages
}
export const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh-CN',  // 默认语言
  globalInjection: true,  // 允许模板里直接用 $t
  fallbackLocale: 'en-US', // 备用语言
  messages: loadLocaleMessages()
})
