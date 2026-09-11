<script setup lang="ts">
const {
  chat,
  messages,
  isStreaming = false,
} = defineProps<{
  chat: Chat
  messages: ChatMessage[]
  isStreaming?: boolean
}>()

const emit = defineEmits<{
  'send-message': [text: string]
}>()

const sendMessage = (text: string) => {
  emit('send-message', text)
}

const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll()

// TODO: add computeds `hasMessages` (messages.value.length > 0) and
//       `chatTitle` (chat.value.title || fallback), or expose them from
//       useChat, and use them in the template instead of inline expressions.

// FIXME: deep-watching the whole array gets expensive once streaming appends
//        tokens. Watch messages.value.length / the last message id, or drive
//        pinToBottom from an addMessage action instead.
watch(() => messages, pinToBottom, { deep: true })
</script>

<template>
  <!-- TODO: `box-border` is redundant with Tailwind Preflight. -->
  <div ref="scrollContainer" class="h-full box-border overflow-y-auto">
    <UContainer class="h-full max-w-[800px]">
      <!-- TODO: use `!hasMessages` once the computed exists. -->
      <!-- TODO: after the layout refactor this branch becomes a placeholder
           inside the message area, leaving a single <ChatTextInput>. -->
      <div v-if="!messages?.length" class="flex items-center justify-center min-h-full">
        <div class="flex flex-col gap-8 w-full p-8 bg-elevated">
          <h2 class="text-xl font-medium text-center text-muted">Start your chat</h2>
          <ChatTextInput :is-streaming="isStreaming" @send-message="sendMessage" />
        </div>
      </div>

      <template v-else>
        <!-- TODO: section heading, not the page title — use <h2>. Move the
             fallback into a `chatTitle` computed + a named constant. -->
        <div class="flex items-center justify-between py-4 mb-6">
          <h1 class="text-2xl font-bold text-default">
            {{ chat?.title || 'Untitled Chat' }}
          </h1>
        </div>

        <!-- TODO: extract <ChatMessageList> (this wrapper + v-for) and
             <ChatMessageItem> (a single bubble). -->
        <!-- TODO: a11y — render as <ul>/<li> or role="log" aria-live="polite"
             so new messages are announced. -->
        <!-- FIXME: `pb-32` is a guessed spacer for the fixed input; it goes
             away with the flex-column layout below. -->
        <div class="flex flex-col gap-4 mb-6 pb-32">
          <!-- TODO: move role-based styling into <ChatMessageItem> (a `variant`
               prop or class map, not this inline ternary). -->
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
            <!-- TODO: `[overflow-wrap:break-word]` duplicates `break-words`. -->
            <div class="text-default whitespace-pre-wrap break-words [overflow-wrap:break-word]">
              <MarkdownRenderer :content="message.content" />
            </div>
          </div>

          <template v-if="isStreaming">
            <span class="inline-block mr-1 animate-pulse duration-1000"> &#9611; </span>
          </template>
        </div>

        <!-- FIXME: position:fixed + max-width + translateX centering +
             w-[calc(100%-3rem)] is fragile. Replace with a flex column layout
             (header + flex-1 overflow-y-auto list + input as a normal child);
             removes this wrapper, the centering hack and the `pb-32` spacer. -->
        <div
          class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[800px] z-10"
        >
          <!-- TODO: extract <ChatScrollToBottomButton>. -->
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
          <ChatTextInput :is-streaming="isStreaming" @send-message="sendMessage" />
        </div>
      </template>
    </UContainer>
  </div>
</template>
