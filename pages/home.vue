<template>
  <div class="text-center">
    <div class="h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
        무엇을 도와드릴까요?
      </h1>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">
        원하시는 소식 및 이슈와 관련된 내용을 입력해 주세요
      </p>
      <!-- 질문창과 버튼 -->
      <div class="mt-4 w-full max-w-2xl mx-auto space-y-8">
        <LLMQuestion placeholder="원하시는 키워드를 입력해 주세요" buttonText="검색하기" />
        <!-- 아티클로 버튼 -->
        <div class="flex gap-2">
          <UButton to="/articles" class="flex-1 py-3 justify-center items-center rounded-lg" variant="outline"
            color="neutral">
            <UIcon name="heroicons-solid:exclamation-circle" size="24" />
            <span class="text-lg font-bold">이슈</span>
          </UButton>
          <UButton to="/commentary" class="flex-1 py-3 justify-center items-center rounded-lg" variant="outline"
            color="neutral">
            <UIcon name="heroicons-solid:chat-bubble-left-ellipsis" size="24" />
            <span class="text-lg font-bold">논평</span>
          </UButton>
        </div>
      </div>
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
  // middleware: 'auth'
})
</script>
