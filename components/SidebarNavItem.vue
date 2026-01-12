<template>
  <NuxtLink :to="to"
    class="flex flex-col items-center px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
    :class="isActive ? 'bg-gray-200 dark:bg-gray-700' : ''">
    <Icon :name="activeIconName" class="w-6 h-6" />
    <span class="text-sm" :class="isActive ? 'font-bold' : ''">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SidebarNavItemProps } from '~/types'

const props = defineProps<SidebarNavItemProps>()

// active 상태에 따라 아이콘 name 변경: outline -> solid
const activeIconName = computed(() => {
  if (props.isActive) {
    // heroicons-outline:xxx -> heroicons-solid:xxx로 변경
    return props.icon.replace('heroicons-outline:', 'heroicons-solid:')
  }
  return props.icon
})
</script>
