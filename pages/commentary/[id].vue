<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>
    <div v-else class="max-w-4xl mx-auto space-y-4">
      <div>
        <h1 class="text-4xl font-semibold leading-normal mb-3">{{ commentary?.title }}</h1>
        <div class="flex space-x-2">
          <span class="text-sm text-gray-700">{{ timeAgo }}</span>
          <span class="text-sm text-gray-700">|</span>
          <span class="text-sm text-gray-700">{{ commentary?.source_count }}개의 출처</span>
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-200 whitespace-pre-line pb-20">{{ commentary?.content }}</p>
    </div>

    <!-- llm 질문 컴포넌트 - 화면 하단 중앙 고정 -->
    <div class="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
      <div class="w-full max-w-4xl px-4">
        <LLMQuestion placeholder="Nana Banana가 아닌 Whisper로 수정해주세요." />
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
const route = useRoute()
import type { Commentary } from '~/types'
// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})

const loading = ref(true)
const { fetchCommentary } = useCommentary()
const commentary = ref<Commentary | null>(null)

//article.original_write_at으로부터 몇시간 전인지 계산 (24시간 후로는 며칠 전인지 계산)
const timeAgo = computed(() => {
  const now = new Date()
  const originalDate = new Date(commentary.value?.original_write_at || '')
  const diffTime = Math.abs(now.getTime() - originalDate.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  if (diffHours < 24) {
    return `${diffHours}시간 전`
  } else {
    return `${Math.ceil(diffHours / 24)}일 전`
  }
})
onMounted(async () => {
  try {
    loading.value = true
    const response = await fetchCommentary(Number(route.params.id))
    if (response.success && response.data) {
      commentary.value = response.data.commentary
    } else {
      console.error('Failed to fetch commentary:', response.error?.message)
    }
  } catch (error) {
    console.error('Failed to fetch commentary:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>