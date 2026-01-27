<template>
  <NuxtLink :to="`/articles/${article.id}`"
    class="flex flex-col min-h-36 sm:flex-row p-4 border-b border-gray-200 dark:border-gray-700">
    <!-- 썸네일 이미지 (모바일: 위, 데스크톱: 우측) -->
    <div v-if="thumbnailImage" class="mb-4 sm:mb-0 sm:ml-4 sm:shrink-0 order-first sm:order-last">
      <NuxtImg :src="thumbnailImage" :alt="article.title" class="w-full sm:w-52 h-48 sm:h-36 object-cover rounded-md" />
    </div>
    <!-- 텍스트 콘텐츠 -->
    <div class="flex-1 flex flex-col">
      <h1 class="text-3xl font-semibold leading-normal mb-3">{{ article.title }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-200 mb-3">{{ limitedContent }}</p>
      <div class="flex space-x-2">
        <span class="text-sm text-gray-700">{{ timeAgo }}</span>
        <span class="text-sm text-gray-700">|</span>
        <span class="text-sm text-gray-700">{{ article.publisher }}</span>
        <span class="text-sm text-gray-700">|</span>
        <span class="text-sm text-gray-700">사용된 토큰: 1000개</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Article } from '~/types'
import { timeAgo as getTimeAgo } from '~/utils/timeAgo'

const props = defineProps<{
  article: Article
}>()

const contentType = computed(() => {
  return props.article.contentType
})

// articleStructure에서 첫 번째 이미지 추출
const thumbnailImage = computed(() => {
  try {
    const structure = JSON.parse(props.article.articleStructure || '[]')
    const firstImage = structure.find((item: any) => item.type === 'image')
    return firstImage?.url || null
  } catch {
    return null
  }
})

//article.articleTxt 글자 수 제한
const limitedContent = computed(() => {
  const propName = contentType.value == 'ARTICLE' ? 'articleTxt' : 'youtubeSummary'
  return props.article[propName]?.slice(0, 100) + '...'
})

//article.originalWriteAt으로부터 몇시간 전인지 계산
const timeAgo = computed(() => {
  return getTimeAgo(props.article.originalWriteAt)
})

</script>

<style scoped></style>