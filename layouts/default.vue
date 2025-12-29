<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 헤더 -->
    <AppHeader />

    <div class="flex">
      <!-- 좌측 사이드바 -->
      <AppSidebar />

      <!-- 메인 콘텐츠 영역 -->
      <main class="flex-1 ml-18 pt-16">
        <div class="p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 레이아웃은 각 페이지의 미들웨어에서 인증을 처리함
</script>
