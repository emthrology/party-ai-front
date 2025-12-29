<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="fixed top-4 right-4 z-50">
      <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" variant="ghost" aria-label="Toggle color mode"
        @click="toggleDark" />
    </div>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
// Nuxt auto-imports useColorMode and computed
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDark = () => {
  // 현재 실제 테마 값(value)을 기반으로 반대 테마로 preference 설정
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
