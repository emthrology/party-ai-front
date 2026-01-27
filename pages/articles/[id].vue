<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="heroicons-solid:arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>
    <div v-else class="max-w-4xl mx-auto space-y-4">
      <div class="flex justify-between max-h-48 overflow-hidden">
        <div>
          <h1 class="text-4xl font-semibold leading-normal mb-3">{{ article?.title }}</h1>
          <div class="flex space-x-2">
            <span class="text-sm text-gray-700">{{ timeAgo }}</span>
            <span class="text-sm text-gray-700">|</span>
            <NuxtLink :to="article?.originalLink" target="_blank" class="text-sm text-gray-700 flex items-center gap-1">
              <span class="text-sm text-gray-700">출처</span>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 mb-[2px]" />
            </NuxtLink>
            <span class="text-sm text-gray-700">|</span>
            <span class="text-sm text-gray-700">{{ article?.publisher }}</span>
          </div>
        </div>
        <div v-if="headerImage" class="shrink-0">
          <NuxtImg :src="headerImage" :alt="article?.title || ''"
            class="h-full max-h-48 w-auto object-cover rounded-md" />
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-200 whitespace-pre-line">{{ content }}</p>

      <div class="fixed bottom-0 left-0 right-0 h-16 bg-transparent opacity-50">
        <div class="max-w-4xl mx-auto h-full flex items-center justify-end">
          <div class="gap-2 flex">
            <UButton icon="i-heroicons-chevron-left" color="neutral" @click="handlePreviousArticle" />
            <UButton icon="i-heroicons-chevron-right" color="neutral" @click="handleNextArticle" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
import type { Article } from '~/types'
import { timeAgo as getTimeAgo } from '~/utils/timeAgo'
// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  // middleware: 'auth' // 인증이 필요한 페이지
})

const loading = ref(true)
const { fetchArticle } = useArticles()
const article = ref<Article | null>(null)
const prevId = ref<number | null>(null)
const nextId = ref<number | null>(null)

// articleStructure에서 첫 번째 이미지 추출
const headerImage = computed(() => {
  if (!article.value?.articleStructure) return null
  try {
    const structure = JSON.parse(article.value.articleStructure)
    const firstImage = structure.find((item: any) => item.type === 'image')
    return firstImage?.url || null
  } catch {
    return null
  }
})

const contentType = computed(() => {
  return article.value?.contentType
})

const content = computed(() => {
  const propName = contentType.value == 'ARTICLE' ? 'articleTxt' : 'youtubeSummary'
  return article.value?.[propName]
})

//article.originalWriteAt으로부터 몇시간 전인지 계산
const timeAgo = computed(() => {
  return getTimeAgo(article.value?.originalWriteAt)
})

const handlePreviousArticle = () => {
  if (prevId.value) {
    navigateTo(`/articles/${prevId.value}`)
  }
  console.log('previous article')
}

const handleNextArticle = () => {
  if (nextId.value) {
    navigateTo(`/articles/${nextId.value}`)
  }
  console.log('next article')
}
onMounted(async () => {
  try {
    loading.value = true
    const response = await fetchArticle(Number(route.params.id))
    if (response && response.crawl) {
      article.value = response.crawl
      prevId.value = response.prevId ?? null
      nextId.value = response.nextId ?? null
    } else {
      console.error('Failed to fetch article:', response.error?.message)
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>