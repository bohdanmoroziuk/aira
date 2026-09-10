<script setup lang="ts">
const { chat, messages, isStreaming, sendMessage } = useChat()
const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll()

watch(() => messages.value, pinToBottom, { deep: true })
</script>

<template>
  <div ref="scrollContainer" class="h-full box-border overflow-y-auto">
    <UContainer class="h-full max-w-[800px]">
      <div
        v-if="!messages?.length"
        class="flex items-center justify-center min-h-full"
      >
        <div class="flex flex-col gap-8 w-full p-8 bg-elevated">
          <h2 class="text-xl font-medium text-center text-muted">
            Start your chat
          </h2>
          <ChatTextInput
            :is-streaming="isStreaming"
            @send-message="sendMessage"
          />
        </div>
      </div>

      <template v-else>
        <div class="flex items-center justify-between py-4 mb-6">
          <h1 class="text-2xl font-bold text-default">
            {{ chat?.title || 'Untitled Chat' }}
          </h1>
        </div>
        <div class="flex flex-col gap-4 mb-6 pb-32">
          <div
            v-for="message in messages"
            :key="message.id"
            class="rounded-[var(--ui-radius)] transition-all duration-200"
            :class="
              message.role === 'user'
                ? 'self-end w-[70%] p-4 bg-muted border border-default'
                : 'w-full py-4 bg-transparent'
            "
          >
            <div
              class="text-default whitespace-pre-wrap break-words [overflow-wrap:break-word]"
            >
              {{ message.content }}
            </div>
          </div>
        </div>

        <div
          class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[800px] z-10"
        >
          <div
            class="absolute bottom-[calc(100%+1rem)] left-0 w-full flex justify-center pointer-events-none"
          >
            <UButton
              v-if="showScrollButton"
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-down"
              aria-label="Scroll to latest messages"
              class="rounded-full shadow-sm pointer-events-auto"
              @click="() => scrollToBottom()"
            />
          </div>
          <ChatTextInput
            :is-streaming="isStreaming"
            @send-message="sendMessage"
          />
        </div>
      </template>
    </UContainer>
  </div>
</template>
