<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-gray-200 dark:bg-gray-700 border-b border-gray-700 z-40">
    <div class="h-full flex items-center justify-between px-4">
      <!-- 좌측 영역: 메뉴 이름 (로고는 사이드바로 이동) -->
      <div class="flex items-center ml-18">
        <!-- 현재 메뉴 이름 -->
        <span class="text-gray-900 dark:text-white text-sm">{{ currentMenuName }}</span>
      </div>

      <!-- 우측 메뉴: 다크모드 토글 -->
      <div class="flex items-center">
        <UButton :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" variant="ghost"
          class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Toggle color mode" @click="toggleDark" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()
const isDark = computed(() => colorMode.value === 'dark')

// 현재 라우트에 따른 메뉴 이름 매핑
const menuMap: Record<string, string> = {
  '/articles': '기사',
  '/commentary': '논평',
  '/poll': '폴',
  '/mypage': '마이페이지',
  '/home': '홈',
}

// 현재 활성화된 메뉴 이름
const currentMenuName = computed(() => {
  // 라우트 경로가 메뉴 맵에 있으면 해당 이름 반환
  for (const [path, name] of Object.entries(menuMap)) {
    if (route.path.startsWith(path)) {
      return name
    }
  }
  // 기본값
  return '기사'
})

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
