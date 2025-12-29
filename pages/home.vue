<template>
  <div class="text-center">
    <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
      환영합니다!
    </h1>
    <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
      {{ user?.name || user?.email }}님, 로그인에 성공했습니다.
    </p>
    <!-- 아티클로 버튼 -->
    <div class="mt-8 space-x-4">
      <UButton to="/articles" variant="solid" color="secondary">
        아티클로 이동
      </UButton>
      <UButton to="/mypage" variant="subtle" color="secondary">
        마이페이지로 이동
      </UButton>
    </div>
  </div>
</template>

<script setup>
const { user, logout, isAuthenticated } = useAuth()

// 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
if (!isAuthenticated.value) {
  await navigateTo('/')
}


// 페이지 메타 정보
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>
