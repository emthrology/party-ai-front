<template>
  <div>
    <h1>Articles</h1>
  </div>
</template>

<script setup lang="ts">
// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})
</script>