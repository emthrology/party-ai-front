<template>
  <div
    class="fixed bottom-0 left-0 right-0 h-16 bg-gray-50 dark:bg-gray-700 opacity-90 flex items-center justify-center">
    <div class="flex items-center gap-2">
      <UButton variant="ghost" color="neutral" @click="$emit('previous')" :disabled="currentPage === 1"
        class="flex items-center gap-2">
        <UIcon name="heroicons-solid:chevron-left" size="20" />
        <span class="text-sm text-gray-700 dark:text-gray-300">이전</span>
      </UButton>
      <template v-for="page in visiblePages" :key="page">
        <UButton :variant="currentPage === page ? 'outline' : 'ghost'" size="lg" color="neutral"
          @click="$emit('page', page)">
          {{ page }}
        </UButton>
      </template>
      <UButton variant="ghost" color="neutral" @click="$emit('next')" :disabled="currentPage === totalPages"
        class="flex items-center gap-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">다음</span>
        <UIcon name="heroicons-solid:chevron-right" size="20" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  previous: []
  next: []
  page: [page: number]
}>()

// 표시할 페이지 번호 계산 (현재 페이지 주변 5개)
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  // 끝에 도달했을 때 시작점 조정
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>

<style scoped></style>
