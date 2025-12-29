// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxt/scripts'
  ],

  colorMode: {
    preference: 'system', // 'system', 'light', 'dark' 중 선택
    fallback: 'light', // 시스템 테마를 감지할 수 없을 때 기본값
    hid: 'nuxt-color-mode-script',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  }
})