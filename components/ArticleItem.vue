<template>
  <NuxtLink :to="`/articles/${article.id}`"
    class="flex flex-col min-h-36 sm:flex-row p-4 border-b border-gray-200 dark:border-gray-700">
    <!-- 썸네일 이미지 (모바일: 위, 데스크톱: 우측) -->
    <div v-if="article.image?.thumbnail" class="mb-4 sm:mb-0 sm:ml-4 sm:shrink-0 order-first sm:order-last">
      <NuxtImg :src="article.image.thumbnail" :alt="article.title"
        class="w-full sm:w-52 h-48 sm:h-36 object-cover rounded-md" />
    </div>
    <!-- 텍스트 콘텐츠 -->
    <div class="flex-1 flex flex-col">
      <h1 class="text-3xl font-semibold leading-normal mb-3">{{ article.title }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-200 mb-3">{{ limitedContent }}</p>
      <div class="flex space-x-2">
        <span class="text-sm text-gray-700">{{ timeAgo }}</span>
        <span class="text-sm text-gray-700">|</span>
        <span class="text-sm text-gray-700">{{ article.platform }}</span>
        <span class="text-sm text-gray-700">|</span>
        <span class="text-sm text-gray-700">사용된 토큰: 1000개</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

const props = defineProps<{
  article: Article
}>()

//article.content 글자 수 제한
const limitedContent = computed(() => {
  return props.article.content.slice(0, 100) + '...'
})

//article.original_write_at으로부터 몇시간 전인지 계산 (24시간 후로는 며칠 전인지 계산)
const timeAgo = computed(() => {
  const now = new Date()
  const originalDate = new Date(props.article.original_write_at)
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