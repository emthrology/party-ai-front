<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
      <UIcon
        name="heroicons-solid:arrow-path"
        class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400"
      />
    </div>
    <div v-else class="flex gap-6 max-w-6xl mx-auto space-y-4 mb-18 pb-32">
      <!-- 좌측 -->
      <div class="flex-1">
        <div>
          <h1 class="text-4xl font-semibold leading-normal mb-3">
            {{ commentary?.title }}
          </h1>
          <!-- <div class="w-full flex justify-end">
            <UButton @click="() => { copyText(commentary?.text) }" variant="outline" color="neutral"
              class="flex items-center gap-2">
              <UIcon name="heroicons:clipboard-document-list" size="20" />
              <span>본문 복사</span>
            </UButton>
          </div> -->
          <div class="flex space-x-2">
            <span class="text-sm text-gray-700">{{ timeAgo }}</span>
            <span class="text-sm text-gray-700">|</span>
            <span class="text-sm text-gray-700"
              >{{ sourceCount }}개의 출처</span
            >
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-200 whitespace-pre-line pb-20">
          {{ commentary?.text }}
        </p>

        <!-- 업데이트된 코멘터리들 -->
        <div
          v-for="updatedCommentary in updatedCommentaries"
          :key="updatedCommentary.id"
          class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex justify-between items-center mb-3">
            <h2 class="text-2xl font-semibold leading-normal">
              {{ updatedCommentary.title }}
            </h2>
            <UButton
              variant="outline"
              color="neutral"
              class="flex items-center gap-2"
              @click="handleAdoptCommentary(sessionId!, updatedCommentary.id)"
            >
              <span>채택하기</span>
            </UButton>
          </div>
          <p class="text-gray-600 dark:text-gray-200 whitespace-pre-line">
            {{ displayedTexts[updatedCommentary.id] || '' }}
            <span v-if="isTyping[updatedCommentary.id]" class="animate-pulse"
              >|</span
            >
          </p>
        </div>

        <!-- 업데이트 중 로딩 스피너 -->
        <div
          v-if="isUpdating"
          class="flex justify-center items-center py-8 mb-3"
        >
          <UIcon
            name="heroicons-solid:arrow-path"
            class="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400"
          />
          <span class="ml-3 text-gray-600 dark:text-gray-400"
            >논평 수정 중...</span
          >
        </div>
      </div>
      <!-- 우측 -->
      <div class="w-1/5 shrink-0">
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div class="border-b border-gray-200 dark:border-gray-700 mb-4 pb-2">
            <h2
              class="text-lg font-bold text-left text-gray-900 dark:text-white"
            >
              업데이트 히스토리
            </h2>
          </div>

          <!-- 업데이트 히스토리 -->
          <div class="space-y-0">
            <div
              v-for="(update, index) in visibleUpdateHistory"
              :key="update.revision.id"
              class="pb-4"
            >
              <div
                v-if="index > 0"
                class="border-t border-gray-200 dark:border-gray-700 mb-4"
              ></div>
              <button
                type="button"
                class="w-full text-left space-y-1 rounded-md p-1 -m-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                @click="openRevision(update.revision)"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ update.date }} | {{ update.time }}
                </div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ update.item }}
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300">
                  {{ update.action }}
                </div>
              </button>
            </div>
          </div>

          <!-- 더 보기 / 축소하기 -->
          <button
            v-if="isHistoryExpandable"
            type="button"
            class="w-full flex justify-center items-center gap-1 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
            @click="isHistoryExpanded = !isHistoryExpanded"
          >
            <span>{{
              isHistoryExpanded
                ? '축소하기'
                : `더 보기 (${updateHistory.length - HISTORY_PREVIEW_COUNT})`
            }}</span>
            <UIcon
              :name="
                isHistoryExpanded
                  ? 'heroicons-solid:chevron-up'
                  : 'heroicons-solid:chevron-down'
              "
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- 히스토리 상세 모달 -->
    <UModal
      v-model:open="isRevisionModalOpen"
      :title="selectedRevision?.title"
      :description="selectedRevisionMeta"
      :ui="{ content: 'max-w-3xl' }"
    >
      <template #body>
        <p
          class="text-gray-600 dark:text-gray-200 whitespace-pre-line max-h-[60vh] overflow-y-auto"
        >
          {{ selectedRevision?.text }}
        </p>
      </template>
    </UModal>

    <!-- llm 질문 컴포넌트 - 화면 하단 중앙 고정 -->
    <div class="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
      <div class="flex flex-col items-center w-full max-w-2xl px-4">
        <LLMQuestion
          placeholder="수정할 내용을 입력해주세요."
          buttonText="수정하기"
          @submit="handleSubmit"
        />
        <div class="w-full max-w-2xl mx-auto flex gap-2 mt-2">
          <UButton
            @click="createCardNews"
            variant="outline"
            color="neutral"
            class="flex items-center gap-2"
          >
            <UIcon name="heroicons:photo" size="20" />
            <span>카드뉴스 생성</span>
          </UButton>
          <UButton
            @click="createShorts"
            variant="outline"
            color="neutral"
            class="flex items-center gap-2"
          >
            <UIcon name="simple-icons:youtubeshorts" size="20" />
            <span>쇼츠 생성</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
import type { Commentary, Revision } from '~/types';
import { timeAgo as getTimeAgo } from '~/utils/timeAgo';
// 인증 미들웨어 적용
definePageMeta({
  layout: 'default',
  middleware: 'auth', // 인증이 필요한 페이지
});

const loading = ref(true);
const isUpdating = ref(false);
const {
  fetchCommentary,
  fetchRevisions,
  createAISession,
  streamMessage,
  adoptCommentary,
} = useCommentary();
const commentary = ref<Commentary | null>(null);
const updatedCommentaries = ref<Commentary[]>([]);
const displayedTexts = ref<Record<number, string>>({});
const isTyping = ref<Record<number, boolean>>({});

const sessionId = ref<number | null>(null);
const currentStreamingCommentaryId = ref<number | null>(null);

// 업데이트 히스토리 (과거 리비전 목록, 최신순)
const revisions = ref<Revision[]>([]);

const updateHistory = computed(() =>
  [...revisions.value]
    .sort((a, b) => b.revisionNo - a.revisionNo)
    .map((revision) => {
      const [date = '', time = ''] = revision.createdAt.split('T');
      return {
        date,
        time: time.slice(0, 8),
        item:
          revision.revisionNo === 0
            ? '원본 논평'
            : `논평_${revision.revisionNo}`,
        action: revision.revisionNo === 0 ? 'AI 생성' : 'AI 수정',
        revision,
      };
    }),
);

// 히스토리 항목 클릭 시 해당 시점의 논평 전문을 모달로 보여준다
const selectedRevision = ref<Revision | null>(null);
const isRevisionModalOpen = ref(false);

const selectedRevisionMeta = computed(() => {
  const entry = updateHistory.value.find(
    ({ revision }) => revision.id === selectedRevision.value?.id,
  );
  return entry ? `${entry.item} · ${entry.date} ${entry.time}` : '';
});

const openRevision = (revision: Revision) => {
  selectedRevision.value = revision;
  isRevisionModalOpen.value = true;
};

// 기본은 3개까지만 노출하고, 그보다 많을 때만 더 보기/축소하기 토글을 띄운다
const HISTORY_PREVIEW_COUNT = 3;
const isHistoryExpanded = ref(false);

const isHistoryExpandable = computed(
  () => updateHistory.value.length > HISTORY_PREVIEW_COUNT,
);

const visibleUpdateHistory = computed(() =>
  isHistoryExpanded.value
    ? updateHistory.value
    : updateHistory.value.slice(0, HISTORY_PREVIEW_COUNT),
);

// usedCrawledIds를 파싱하여 출처 개수 계산
const sourceCount = computed(() => {
  if (!commentary.value?.usedCrawledIds) return 0;
  try {
    const ids = JSON.parse(commentary.value.usedCrawledIds);
    return Array.isArray(ids) ? ids.length : 0;
  } catch {
    return 0;
  }
});

// createdAt으로부터 몇시간 전인지 계산
const timeAgo = computed(() => {
  return getTimeAgo(commentary.value?.createdAt);
});

const copyText = (text: string | undefined) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert('복사되었습니다.');
};

const createCardNews = () => {
  // TODO 새 창 생성
  window.open(`https://card.jayuparty.kr/`, '_blank');
};

const createShorts = () => {
  // TODO 새 창 생성
  window.open(`https://shorts.jayuparty.kr/`, '_blank');
};

const commentaryId = computed(() => Number(route.params.id));

// 채택 시 세션이 닫히므로 세션을 새로 만들고, 본문과 히스토리를 함께 갱신한다
const loadCommentary = async () => {
  const session = await createAISession(commentaryId.value);
  sessionId.value = session.id;
  commentary.value = await fetchCommentary(commentaryId.value);

  try {
    revisions.value = await fetchRevisions(commentaryId.value);
  } catch (error) {
    console.error('Failed to fetch revisions:', error);
    revisions.value = [];
  }
};

const handleAdoptCommentary = async (
  adoptSessionId: number,
  messageId: number,
) => {
  try {
    await adoptCommentary(adoptSessionId, messageId);

    // 채택본이 새 본문이 되므로 진행 중이던 수정안 목록을 비운다
    updatedCommentaries.value = [];
    displayedTexts.value = {};
    isTyping.value = {};
    currentStreamingCommentaryId.value = null;

    await loadCommentary();
  } catch (error) {
    console.error('채택 실패:', error);
    alert('채택에 실패했습니다.');
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
};

// isUpdating이 true가 될 때 스크롤을 맨 아래로 이동
watch(isUpdating, (newValue) => {
  if (newValue) {
    scrollToBottom();
  }
});

// 타이핑 애니메이션 함수 (한 단어씩)
const typeText = (commentaryId: number, fullText: string) => {
  isTyping.value[commentaryId] = true;
  displayedTexts.value[commentaryId] = '';

  // 텍스트를 줄 단위로 분할하고, 각 줄을 단어 단위로 분할
  const lines = fullText.split('\n');
  const wordsByLine: string[][] = lines.map((line) => {
    // 공백, 구두점을 기준으로 단어 분할 (한글과 영어 모두 처리)
    // 정규식: 공백, 구두점(., ,, !, ?, :, ;, 등)을 기준으로 분할하되, 구두점도 포함
    return line
      .split(/(\s+|[.,!?:;，。！？：；])/)
      .filter((word) => word.length > 0);
  });

  let currentLineIndex = 0;
  let currentWordIndex = 0;

  const typeNextWord = () => {
    if (currentLineIndex >= wordsByLine.length) {
      isTyping.value[commentaryId] = false;
      return;
    }

    const currentLineWords = wordsByLine[currentLineIndex];
    if (!currentLineWords || currentWordIndex >= currentLineWords.length) {
      // 현재 줄의 단어를 모두 표시했으면 다음 줄로
      if (currentLineIndex < wordsByLine.length - 1) {
        const currentText = displayedTexts.value[commentaryId] || '';
        displayedTexts.value[commentaryId] = currentText + '\n';
      }
      currentLineIndex++;
      currentWordIndex = 0;
      setTimeout(typeNextWord, 100); // 줄바꿈 시 약간의 딜레이
      return;
    }

    // 현재 단어 추가
    const currentWord = currentLineWords[currentWordIndex];
    if (!currentWord) {
      currentWordIndex++;
      setTimeout(typeNextWord, 30);
      return;
    }

    const currentText = displayedTexts.value[commentaryId] || '';
    displayedTexts.value[commentaryId] = currentText + currentWord;
    currentWordIndex++;

    // 다음 단어로 (단어 길이에 따라 속도 조절)
    const delay = currentWord.trim().length > 0 ? 40 : 10; // 공백은 빠르게, 단어는 조금 느리게
    setTimeout(typeNextWord, delay);
  };

  typeNextWord();
};

const handleSubmit = async (question: string | undefined) => {
  if (!question || !commentary.value || !sessionId.value) return;

  try {
    isUpdating.value = true;

    // 임시 코멘터리 생성 (타이핑 애니메이션용)
    const tempCommentaryId = Date.now();
    const tempCommentary: Commentary = {
      id: tempCommentaryId,
      summaryId: commentary.value.summaryId,
      type: 'COMMENTARY',
      title: question,
      text: '',
      usedCrawledIds: commentary.value.usedCrawledIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updatedCommentaries.value.push(tempCommentary);
    currentStreamingCommentaryId.value = tempCommentaryId;
    displayedTexts.value[tempCommentaryId] = '';
    isTyping.value[tempCommentaryId] = true;

    // 스크롤을 맨 아래로 이동
    scrollToBottom();

    // 스트림 메시지 읽기
    const result = await streamMessage(
      sessionId.value,
      question,
      (chunk: string) => {
        // 실시간으로 텍스트 추가 (타이핑 애니메이션 효과)
        if (currentStreamingCommentaryId.value) {
          const currentText =
            displayedTexts.value[currentStreamingCommentaryId.value] || '';
          displayedTexts.value[currentStreamingCommentaryId.value] =
            currentText + chunk;

          // 스크롤을 계속 맨 아래로 유지
          scrollToBottom();
        }
      },
    );

    // 스트리밍 완료 후 최종 텍스트 업데이트
    if (currentStreamingCommentaryId.value && result) {
      // 콘텐츠가 있는 경우에만 업데이트
      if (result.content && result.content.length > 0) {
        console.log(result, 3232323);

        isTyping.value[currentStreamingCommentaryId.value] = false;

        // 실제 코멘터리 업데이트
        const commentaryIndex = updatedCommentaries.value.findIndex(
          (c) => c.id === currentStreamingCommentaryId.value,
        );
        if (commentaryIndex !== -1) {
          const existing = updatedCommentaries.value[commentaryIndex];
          if (existing) {
            const oldId = currentStreamingCommentaryId.value;
            const newId = result.id || oldId;

            // displayedTexts와 isTyping의 키를 임시 ID에서 실제 ID로 변경
            if (oldId !== newId && displayedTexts.value[oldId]) {
              displayedTexts.value[newId] = displayedTexts.value[oldId];
              delete displayedTexts.value[oldId];
            }
            if (oldId !== newId && isTyping.value[oldId] !== undefined) {
              isTyping.value[newId] = isTyping.value[oldId];
              delete isTyping.value[oldId];
            }

            updatedCommentaries.value[commentaryIndex] = {
              id: newId,
              summaryId: existing.summaryId,
              type: existing.type,
              title: existing.title,
              text: result.content,
              usedCrawledIds: existing.usedCrawledIds,
              createdAt: existing.createdAt,
              updatedAt: existing.updatedAt,
            };
          }
        }
      } else {
        // 콘텐츠가 없으면 에러로 처리하지 않고 유지
        console.warn('Stream completed but no content received');
        isTyping.value[currentStreamingCommentaryId.value] = false;
      }
    }

    // currentStreamingCommentaryId.value = null
  } catch (error) {
    console.error('Failed to stream message:', error);

    // 에러 발생 시에도 이미 표시된 콘텐츠는 유지
    if (currentStreamingCommentaryId.value) {
      const currentContent =
        displayedTexts.value[currentStreamingCommentaryId.value] || '';

      // 콘텐츠가 있으면 유지, 없으면 제거
      if (currentContent.length > 0) {
        // 타이핑 상태만 종료
        isTyping.value[currentStreamingCommentaryId.value] = false;

        // 코멘터리 텍스트 업데이트
        const commentaryIndex = updatedCommentaries.value.findIndex(
          (c) => c.id === currentStreamingCommentaryId.value,
        );
        if (commentaryIndex !== -1) {
          const existing = updatedCommentaries.value[commentaryIndex];
          if (existing) {
            updatedCommentaries.value[commentaryIndex] = {
              ...existing,
              text: currentContent,
            };
          }
        }
      } else {
        // 콘텐츠가 없으면 제거
        const index = updatedCommentaries.value.findIndex(
          (c) => c.id === currentStreamingCommentaryId.value,
        );
        if (index !== -1) {
          updatedCommentaries.value.splice(index, 1);
        }
        delete displayedTexts.value[currentStreamingCommentaryId.value];
        delete isTyping.value[currentStreamingCommentaryId.value];
        alert('코멘터리 업데이트에 실패했습니다.');
      }

      currentStreamingCommentaryId.value = null;
    } else {
      alert('코멘터리 업데이트에 실패했습니다.');
    }
  } finally {
    isUpdating.value = false;
  }
};

onMounted(async () => {
  try {
    loading.value = true;
    await loadCommentary();
  } catch (error) {
    console.error('Failed to fetch commentary:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
