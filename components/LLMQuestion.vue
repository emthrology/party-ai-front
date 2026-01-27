<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- 질문할 내용을 입력하는 폼 -->
    <UForm :state="formState" @submit="handleSubmit">
      <div
        class="flex flex-col gap-2 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3">
        <!-- Textarea 영역 -->
        <div class="flex-1">
          <textarea ref="textareaRef" v-model="formState.question" :placeholder="placeholder"
            class="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base focus:ring-0 focus:outline-none"
            :style="{
              minHeight: '1.5rem',
              maxHeight: '24rem',
              overflowY: textareaHeight >= maxHeight ? 'auto' : 'hidden',
              height: textareaHeight > 0 ? `${textareaHeight}px` : 'auto'
            }" @input="adjustTextareaHeight" rows="1" />
        </div>

        <!-- 검색 버튼 -->
        <div class="flex justify-end">
          <UButton type="submit" :variant="formState.question.trim() ? 'solid' : 'outline'" color="neutral"
            :disabled="!formState.question.trim()" size="sm" class="rounded-lg font-medium whitespace-nowrap px-8 py-2">
            {{ buttonText }}
          </UButton>
        </div>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  placeholder: string
  buttonText: string
}>()
const formState = ref({
  question: ''
})

const emit = defineEmits<{
  submit: [question: string | undefined]
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const textareaHeight = ref(0)
const maxHeight = 24 * 16 // 16줄 기준 높이 (대략 24rem, line-height 1.5 기준)

const adjustTextareaHeight = () => {
  if (!textareaRef.value) return

  // 높이를 초기화하여 정확한 scrollHeight 계산
  textareaRef.value.style.height = 'auto'
  const scrollHeight = textareaRef.value.scrollHeight

  // 최대 높이를 넘지 않도록 제한
  if (scrollHeight <= maxHeight) {
    textareaRef.value.style.height = `${scrollHeight}px`
    textareaHeight.value = scrollHeight
  } else {
    textareaRef.value.style.height = `${maxHeight}px`
    textareaHeight.value = maxHeight
  }
}

const handleSubmit = () => {
  emit('submit', formState.value.question)
  formState.value.question = ''
}

// 컴포넌트 마운트 시 초기 높이 설정
onMounted(() => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

// 값이 변경될 때마다 높이 조정
watch(() => formState.value.question, () => {
  nextTick(() => {
    adjustTextareaHeight()
  })
})

</script>

<style scoped></style>