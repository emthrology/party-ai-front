<template>
  <aside
    class="fixed left-0 top-0 bottom-0 w-18 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-50">
    <nav class="py-4 px-2 space-y-2">
      <!-- 로고 -->
      <div class="flex justify-center mb-4">
        <NuxtLink to="/" class="flex items-center justify-center">
          <img src="@/assets/images/party_logo.png" alt="로고" class="w-10 h-10">
        </NuxtLink>
      </div>

      <!-- 네비게이션 메뉴 -->
      <NuxtLink to="/articles"
        class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        :class="isActive('/articles') ? 'bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
        <span class="text-sm">기사</span>
      </NuxtLink>

      <NuxtLink to="/commentary"
        class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        :class="isActive('/commentary') ? 'bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
        <span class="text-sm">논평</span>
      </NuxtLink>

      <NuxtLink to="/poll"
        class="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        :class="isActive('/poll') ? 'bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'">
        <span class="text-sm">폴</span>
      </NuxtLink>

      <!-- 구분선 -->
      <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

      <!-- 사용자 정보 및 로그아웃 -->
      <div class="space-y-2">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user?.name || '관리자' }}</p>
          </div>
          <div class="py-4">
            <button @click="handleLogout"
              class="w-full flex items-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
              <span class="text-sm">로그아웃</span>
            </button>
          </div>
        </div>


      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await logout()
  await navigateTo('/')
}
</script>
