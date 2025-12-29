<template>
  <div>
    <h1>My Page</h1>
    <p>{{ user?.email }}</p>
    <p>{{ user?.name }}</p>
    <p>{{ user?.id }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth' // 인증이 필요한 페이지
})
const { user } = useAuth()
console.log(user.value)
</script>

<style scoped></style>