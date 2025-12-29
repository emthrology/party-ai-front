<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ error.statusCode }}
        </h2>
      </div>
      <div>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ getErrorMessage() }}
        </p>
      </div>
      <div>
        <UButton to="/" variant="solid" color="neutral">
          홈으로 이동</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

const getErrorMessage = () => {
  if (props.error.statusCode === 404) {
    return '요청 페이지가 존재하지 않거나 이동되었을 수 있습니다.'
  }
  if (props.error.statusCode === 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  if (props.error.statusCode === 403) {
    return '접근 권한이 없습니다. 관리자에게 문의해주세요.'
  }
  if (props.error.statusCode === 401) {
    return '인증 정보가 올바르지 않습니다. 관리자에게 문의해주세요.'
  }
  if (props.error.statusCode === 400) {
    return '잘못된 요청입니다. 관리자에게 문의해주세요.'
  }
  return '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
}

useHead({
  title: `${props.error.statusCode} - ${getErrorMessage()} | 와우플렉스페이`
})
</script>

<style scoped></style>