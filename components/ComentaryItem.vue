<template>
  <NuxtLink :to="`/commentary/${commentary.id}`"
    class="flex flex-col min-h-36 sm:flex-row p-4 border-b border-gray-200 dark:border-gray-700">
    <!-- 텍스트 콘텐츠 -->
    <div class="flex-1 flex flex-col">
      <h1 class="text-3xl font-semibold  leading-normal mb-3">{{ commentary.title }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-200 mb-3">{{ limitedContent }}</p>
      <div class="flex space-x-2">
        <span class="text-sm text-gray-700">{{ timeAgo }}</span>
        <span class="text-sm text-gray-700">|</span>
        <span class="text-sm text-gray-700">{{ commentary.source_count }}개의 출처</span>
        <span class="text-sm text-gray-700">|</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Commentary } from '~/types'

const props = defineProps<{
  commentary: Commentary
}>()

//article.content 글자 수 제한
const limitedContent = computed(() => {
  return props.commentary.content.slice(0, 100) + '...'
})

//article.original_write_at으로부터 몇시간 전인지 계산 (24시간 후로는 며칠 전인지 계산)
const timeAgo = computed(() => {
  const now = new Date()
  const originalDate = new Date(props.commentary.original_write_at)
  const diffTime = Math.abs(now.getTime() - originalDate.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  if (diffHours < 24) {
    return `${diffHours}시간 전`
  } else {
    return `${Math.ceil(diffHours / 24)}일 전`
  }
})

</script>

<style scoped></style>