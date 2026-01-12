<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg ">
      <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          관리자 로그인
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          아이디와 패스워드를 입력해 주세요
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md space-y-4">
          <div>
            <label for="email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">아이디</label>
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
              :class="['appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm', emailFocused ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700']"
              placeholder="아이디 입력해 주세요" @focus="emailFocused = true" @blur="emailFocused = false" />
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">비밀번호</label>
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required
              :class="['appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm', passwordFocused ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-700']"
              placeholder="비밀번호 입력해 주세요" @focus="passwordFocused = true" @blur="passwordFocused = false" />
          </div>
        </div>

        <!-- <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input id="remember-me" v-model="rememberMe" name="remember-me" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              로그인 상태 유지
            </label>
          </div>

          <div class="w-full text-sm text-center">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              비밀번호를 잊으셨나요?
            </a>
          </div>
        </div> -->

        <div v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ errorMessage }}
        </div>

        <div>
          <UButton type="submit" variant="solid" color="neutral" block size="lg" :loading="isLoading"
            class="w-full py-3 text-md font-bold">
            로그인
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const emailFocused = ref(false)
const passwordFocused = ref(false)

const route = useRoute()

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await login(email.value, password.value)
    console.log('result from handleLogin', result)
    if (result.success) {
      // 로그인 성공 시 리다이렉트 URL이 있으면 그곳으로, 없으면 홈으로 이동
      const redirectPath = route.query.redirect || '/home'
      await navigateTo(redirectPath)
    } else {
      errorMessage.value = result.error || '로그인에 실패했습니다.'
    }
  } catch (error) {
    errorMessage.value = error?.message || '로그인 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 페이지 메타 정보
definePageMeta({
  layout: false,
  middleware: 'guest' // 이미 로그인한 사용자는 접근 불가
})
</script>
