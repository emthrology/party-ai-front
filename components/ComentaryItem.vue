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
        <span class="text-sm text-gray-700">{{ sourceCount }}개의 출처</span>
        <span class="text-sm text-gray-700">|</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Commentary } from '~/types'
import { timeAgo as getTimeAgo } from '~/utils/timeAgo'

const props = defineProps<{
  commentary: Commentary
}>()

// text 글자 수 제한
const limitedContent = computed(() => {
  return props.commentary.text.slice(0, 100) + '...'
})

// usedCrawledIds를 파싱하여 출처 개수 계산
const sourceCount = computed(() => {
  if (!props.commentary.usedCrawledIds) return 0
  try {
    const ids = JSON.parse(props.commentary.usedCrawledIds)
    return Array.isArray(ids) ? ids.length : 0
  } catch {
    return 0
  }
})

// createdAt으로부터 몇시간 전인지 계산
const timeAgo = computed(() => {
  return getTimeAgo(props.commentary.createdAt)
})

</script>

<style scoped></style>