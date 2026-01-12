<template>
  <NuxtLink :to="story.url" target="_blank" class="flex flex-col p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex flex-col">
      <h1 class="text-lg font-bold">{{ story.title }}</h1>
      <p class="text-sm text-gray-500">{{ story.time }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Story } from '~/types'

const props = defineProps<{
  story: Story
}>()
</script>

<style scoped></style>