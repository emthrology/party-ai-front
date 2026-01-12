<template>
  <div>
    <!-- 로딩 스피너 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>

    <!-- 코멘터리 목록 -->
    <div v-else>
      <ComentaryItem v-for="commentary in commentaries" :key="commentary.id" :commentary="commentary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commentary } from '~/types'

// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})

const { fetchCommentaries } = useCommentary()
const { fetchStories } = useNews()
const stories = ref<any[]>([])
const commentaries = ref<Commentary[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    stories.value = await fetchStories('top')
    const response = await fetchCommentaries()
    if (response.success && response.data) {
      commentaries.value = response.data
    } else {
      console.error('Failed to fetch commentaries:', response.error)
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
})
</script>