<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 z-50">
    <div class="h-full flex items-center justify-between px-4">
      <!-- 로고 -->
      <div class="flex items-center">
        <NuxtLink to="/" class="text-white text-lg font-semibold">
          <img src="@/assets/images/party_logo.png" alt="로고" class="w-10 h-10">
        </NuxtLink>
      </div>

      <!-- 우측 메뉴 -->
      <div class="flex items-center space-x-4">
        <span class="text-white text-sm">기사</span>
        <!-- 다크모드 토글 -->
        <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" variant="ghost"
          class="text-white hover:text-gray-300" aria-label="Toggle color mode" @click="toggleDark" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
