<script setup lang="ts">
const {
  title,
  messages,
  isStreaming = false,
} = defineProps<{
  title: string
  messages: ChatMessage[]
  isStreaming?: boolean
}>()

const emit = defineEmits<{
  'send-message': [text: string]
}>()

const sendMessage = (text: string) => {
  emit('send-message', text)
}

const scrollContainer = useTemplateRef<HTMLDivElement>('scrollContainer')
const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll(scrollContainer)

const hasMessages = computed(() => {
  return isNonEmpty(messages)
})

watch(
  [
    () => messages.length,
    () => messages.at(-1)?.content,
    () => isStreaming,
  ],
  pinToBottom,
  { flush: 'post' },
)
</script>

<template>
  <div class="h-full min-h-0">
    <UContainer class="flex h-full min-h-0 max-w-200 flex-col">
      <template v-if="hasMessages">
        <div class="flex shrink-0 items-center justify-between py-4">
          <h2 class="text-2xl font-bold text-default">
            {{ title }}
          </h2>
        </div>
      </template>

      <div
        ref="scrollContainer"
        class="min-h-0 flex-1 overflow-y-auto"
      >
        <ChatMessageList
          v-if="hasMessages"
          :messages
        />

        <ChatEmptyState v-else />

        <ChatTypingIndicator
          v-if="isStreaming"
          class="pb-4"
        />
      </div>

      <div class="relative shrink-0 pt-4 pb-6">
        <div
          class="pointer-events-none absolute bottom-[calc(100%+1rem)] left-0 flex w-full justify-center"
        >
          <UButton
            v-if="showScrollButton"
            color="neutral"
            variant="outline"
            icon="i-heroicons-arrow-down"
            aria-label="Scroll to latest messages"
            class="pointer-events-auto rounded-full shadow-sm"
            @click="scrollToBottom()"
          />
        </div>

        <ChatTextInput
          :is-streaming="isStreaming"
          @send-message="sendMessage"
        />
      </div>
    </UContainer>
  </div>
</template>
