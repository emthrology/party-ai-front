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

  icon: {
    clientBundle: {
      scan: true
    },
    provider: 'iconify'
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_BASE
    }
  },

  nitro: {
    routeRules: {
      '/api/**': { 
        proxy: process.env.NUXT_PUBLIC_API_BASE 
          ? `${process.env.NUXT_PUBLIC_API_BASE}/api/**` 
          : 'http://127.0.0.1:8080/api/**'
      }
    }
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system', // 'system', 'light', 'dark' 중 선택
    fallback: 'light', // 시스템 테마를 감지할 수 없을 때 기본값
    hid: 'nuxt-color-mode-script',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  }
})