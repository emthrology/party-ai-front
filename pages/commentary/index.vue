<template>
  <div>
    <!-- 로딩 스피너 -->
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon name="heroicons-solid:arrow-path" class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
    </div>

    <!-- 코멘터리 목록 -->
    <div v-else class="mb-12">
      <ComentaryItem v-for="commentary in commentaries" :key="commentary.id" :commentary="commentary" />
    </div>

    <!-- 하단 페이지네이션 -->
    <Pagination :current-page="currentPage" :total-pages="totalPages" @previous="handlePreviousPage"
      @next="handleNextPage" @page="handlePage" />
  </div>
</template>

<script setup lang="ts">
import type { Commentary } from '~/types'

// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})

const route = useRoute()
const router = useRouter()
const { fetchCommentaries } = useCommentary()
const commentaries = ref<Commentary[]>([])
const loading = ref(true)

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

// 코멘터리 로드 함수
const loadCommentaries = async () => {
  try {
    loading.value = true
    const response = await fetchCommentaries({
      page: currentPage.value - 1, // API는 0-based index를 사용
      size: 10,
      sort: 'createdAt,desc'
    })

    if (!response.empty && response.content) {
      commentaries.value = response.content
      // URL 쿼리와 동기화 (API 응답의 페이지 번호가 다를 수 있음)
      const apiPage = response.pageable.pageNumber + 1
      if (apiPage !== currentPage.value) {
        currentPage.value = apiPage
      }
      totalPages.value = response.totalPages
      totalElements.value = response.totalElements
    } else {
      console.error('Failed to fetch commentaries:', response.error)
    }
  } catch (error) {
    console.error('Failed to fetch commentaries:', error)
  } finally {
    loading.value = false
  }
}

// URL 쿼리 파라미터 변경 감지
watch(() => route.query.page, () => {
  loadCommentaries()
}, { immediate: false })

onMounted(async () => {
  await loadCommentaries()
})
</script>