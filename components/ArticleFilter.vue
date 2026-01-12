<template>
  <div class="bg-white dark:bg-gray-500 rounded-lg shadow-md p-4">
    <div class="border-b border-gray-200 dark:border-gray-700 mb-4 pb-2">
      <h2 class="text-lg font-bold text-center  text-gray-900 dark:text-white">원하는 언론사</h2>
    </div>
    <div class="space-y-2">
      <UButton @click="$emit('filter', null)" :variant="selectedPlatform === null ? 'solid' : 'soft'" color="neutral"
        block class="justify-center min-h-10">
        전체
      </UButton>
      <UButton v-for="platform in platforms" :key="platform" @click="$emit('filter', platform)"
        :variant="selectedPlatform === platform ? 'solid' : 'soft'" color="neutral" block
        class="justify-center min-h-10">
        {{ platform }}
      </UButton>

    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  platforms: string[]
  selectedPlatform: string | null
}>()

defineEmits<{
  filter: [platform: string | null]
}>()
</script>

<style scoped></style>
