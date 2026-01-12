<template>
  <aside
    class="fixed left-0 top-0 bottom-0 w-18 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-50">
    <nav class="h-full flex flex-col justify-between py-4 px-2">
      <!-- 상단 영역: 로고와 네비게이션 메뉴 -->
      <div class="space-y-2">
        <!-- 로고 -->
        <div class="flex justify-center mb-4">
          <NuxtLink to="/" class="flex items-center justify-center">
            <img src="@/assets/images/party_logo.png" alt="로고" class="w-10 h-10">
          </NuxtLink>
          <div class="h-10"></div>
        </div>

        <!-- 네비게이션 메뉴 -->
        <SidebarNavItem v-for="item in menuItems" :key="item.to" :to="item.to" :icon="item.icon" :label="item.label"
          :is-active="isActive(item.to)" />
      </div>

      <!-- 하단 영역: 사용자 정보 및 로그아웃 -->
      <div class="space-y-2">
        <div class="flex flex-col items-center">
          <NuxtLink :to="'/mypage'"
            class="flex flex-col items-center justify-center rounded-[100%] bg-gray-200 dark:bg-gray-700 p-2">
            <Icon name="uil:user" :style="{ color: isDark ? 'white' : 'black' }" class="w-6 h-6" />
            <!-- <div class="flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user?.name || '관리자' }}</p>
            </div> -->
          </NuxtLink>
          <div class="py-4">
            <button @click="handleLogout"
              class="w-full flex flex-col items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <Icon name="material-symbols:logout" :style="{ color: isDark ? 'white' : 'black' }" class="w-6 h-6" />
              <span class="text-sm">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types'

const { user, logout } = useAuth()
const route = useRoute()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// 메뉴 아이템 데이터
const menuItems: MenuItem[] = [
  // { to: '/home', icon: 'uil:home', label: '홈' },
  { to: '/articles', icon: 'heroicons-outline:newspaper', label: '이슈' },
  { to: '/commentary', icon: 'heroicons-outline:chat-bubble-left-ellipsis', label: '논평' },
  // { to: '/poll', icon: 'uil:poll', label: '폴' }, // 필요시 주석 해제
]

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
  await navigateTo('/')
}
</script>
