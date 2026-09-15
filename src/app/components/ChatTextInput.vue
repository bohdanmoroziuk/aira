<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { useAutoResizeTextarea } from '~/composables/useAutoResizeTextarea'
import { useMessageDraft } from '~/composables/useMessageDraft'

const { isStreaming = false } = defineProps<{
  isStreaming?: boolean
}>()

const emit = defineEmits<{
  'send-message': [text: string]
}>()

const TEXTAREA_REF = 'textareaRef'

const { adjustTextareaHeight, focusTextarea } = useAutoResizeTextarea(TEXTAREA_REF)
const { text, noText, resetText } = useMessageDraft()

const handleSendMessage = async () => {
  if (isStreaming) return
  if (noText.value) return

  emit('send-message', text.value.trim())
  resetText()

  await nextTick()
  adjustTextareaHeight()
  focusTextarea()
}

watch(
  () => isStreaming,
  async (value) => {
    if (value === false) {
      await nextTick()
      focusTextarea()
    }
  },
)
</script>

<template>
  <form
    class="relative flex items-center justify-center bg-default overflow-hidden transition-all duration-150 ease-in-out border border-default rounded-[1.8rem] py-4 pr-8 pl-[1.2rem] hover:transform-none focus-within:transform-none hover:outline-none hover:shadow-none"
    @submit.prevent="handleSendMessage"
  >
    <textarea
      :ref="TEXTAREA_REF"
      v-model="text"
      :disabled="isStreaming"
      :rows="1"
      placeholder="Type a message…"
      aria-label="Message"
      class="w-full p-0 mr-6 resize-none bg-transparent outline-none hover:outline-none hover:shadow-md disabled:cursor-not-allowed"
      @input="adjustTextareaHeight"
      @keydown.enter.exact.prevent="handleSendMessage"
    />

    <UButton
      :disabled="noText || isStreaming"
      type="submit"
      color="primary"
      variant="solid"
      icon="i-heroicons-paper-airplane"
      aria-label="Send message"
      class="absolute right-3 bottom-3"
      :ui="{ base: 'rounded-full' }"
      square
    />
  </form>
</template>
