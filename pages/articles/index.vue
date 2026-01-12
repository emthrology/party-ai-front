<template>
  <div>
    <!-- 로딩 스피너 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>

    <!-- 아티클 목록 -->
    <div v-else class="flex gap-6">
      <!-- 좌측: 아티클 리스트 -->
      <div class="flex-1">
        <ArticleItem v-for="article in filteredArticles" :key="article.id" :article="article" />
      </div>

      <!-- 우측: 플랫폼 필터 -->
      <div class="w-1/6 shrink-0">
        <ArticleFilter :platforms="uniquePlatforms" :selected-platform="selectedPlatform" @filter="handleFilter" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})

const { fetchStories } = useNews()
const { fetchArticles } = useArticles()
const stories = ref<any[]>([])
const loading = ref(true)

//msw 모의 데이터 사용
const articles = ref<Article[]>([])
const selectedPlatform = ref<string | null>(null)

// 고유한 플랫폼 목록 추출
// TODO 실제로는 api로 받아와야함
const uniquePlatforms = computed(() => {
  const platforms = new Set(articles.value.map(article => article.platform))
  return Array.from(platforms).sort()
})

// 필터링된 아티클 목록
const filteredArticles = computed(() => {
  if (!selectedPlatform.value) {
    return articles.value
  }
  return articles.value.filter(article => article.platform === selectedPlatform.value)
})

// 필터 핸들러
const handleFilter = (platform: string | null) => {
  selectedPlatform.value = platform
}

onMounted(async () => {
  try {
    loading.value = true
    stories.value = await fetchStories('top')

    const response = await fetchArticles()
    if (response.success && response.data) {
      articles.value = response.data
    } else {
      console.error('Failed to fetch articles:', response.error)
    }
  } catch (error) {
    console.error('Failed to fetch stories:', error)
  } finally {
    loading.value = false
  }
})
</script>