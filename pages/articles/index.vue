<template>
  <div>
    <!-- 로딩 스피너 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="heroicons-solid:arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>

    <!-- 아티클 목록 -->
    <div v-else class="flex gap-6">
      <!-- 좌측: 아티클 리스트 -->
      <div class="flex-1 mb-12">
        <ArticleItem v-for="article in filteredArticles" :key="article.id" :article="article" />
      </div>

      <!-- 우측: 플랫폼 필터 -->
      <div class="w-1/6 shrink-0">
        <div class="sticky top-24">
          <ArticleFilter :platforms="uniquePlatforms" :selected-platform="selectedPlatform" @filter="handleFilter" />
        </div>
      </div>
    </div>
    <!-- 하단 페이지네이션 -->
    <Pagination :current-page="currentPage" :total-pages="totalPages" @previous="handlePreviousPage"
      @next="handleNextPage" @page="handlePage" />
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~/types'

// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  // middleware: 'auth' // 인증이 필요한 페이지
})

const route = useRoute()
const router = useRouter()
const { fetchArticles } = useArticles()
const loading = ref(true)

const articles = ref<Article[]>([])

// URL 쿼리 파라미터에서 상태 읽기
const currentPage = computed({
  get: () => {
    const page = parseInt(route.query.page as string) || 1
    return page
  },
  set: (value) => {
    router.push({ query: { ...route.query, page: value.toString() } })
  }
})

const selectedPlatform = computed({
  get: () => route.query.publisher as string | null || null,
  set: (value) => {
    router.push({
      query: {
        ...route.query,
        publisher: value || undefined,
        page: '1' // 필터 변경 시 첫 페이지로
      }
    })
  }
})

const totalPages = ref(1)
const totalElements = ref(0)

// 페이지네이션 핸들러
const handlePreviousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value = currentPage.value - 1
  }
}

const handleNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value = currentPage.value + 1
  }
}

const handlePage = async (page: number) => {
  currentPage.value = page
}

// 아티클 로드 함수
const loadArticles = async () => {
  try {
    loading.value = true
    const response = await fetchArticles({
      page: currentPage.value - 1, // API는 0-based index를 사용
      size: 10,
      sort: 'originalWriteAt,desc',
      publisher: selectedPlatform.value || undefined
    })
    if (!response.empety && response.content) {
      articles.value = response.content
      // URL 쿼리와 동기화 (API 응답의 페이지 번호가 다를 수 있음)
      const apiPage = response.pageable.pageNumber + 1
      if (apiPage !== currentPage.value) {
        currentPage.value = apiPage
      }
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
    } else {
      console.error('Failed to fetch articles:', response.error)
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error)
  } finally {
    loading.value = false
  }
}

// 고유한 publisher 목록 추출
const uniquePlatforms = computed(() => {
  // const platforms = new Set(articles.value.map(article => article.publisher))
  // return Array.from(platforms).sort()
  return [
    'Fox News',
    'The Guardian',
    '동아일보',
    '조선일보',
    '중앙일보',
    '한겨레',
    '고성국TV',
    '배승희 변호사',
    '성창경TV',
    '신의 한수'
  ].sort((a, b) => a.localeCompare(b))
})

// 필터링된 아티클 목록
const filteredArticles = computed(() => {
  if (!selectedPlatform.value) {
    return articles.value
  }
  return articles.value.filter(article => article.publisher === selectedPlatform.value)
})

// 필터 핸들러
const handleFilter = (platform: string | null) => {
  selectedPlatform.value = platform
}

// URL 쿼리 파라미터 변경 감지
watch([() => route.query.page, () => route.query.publisher], () => {
  loadArticles()
}, { immediate: false })

onMounted(async () => {
  await loadArticles()
})
</script>