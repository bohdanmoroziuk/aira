<script setup lang="ts">
defineProps<{
  messages: ChatMessage[]
}>()
</script>

<template>
  <ol
    class="flex flex-col gap-4 py-4"
    role="log"
    aria-live="polite"
  >
    <ChatMessageItem
      v-for="message in messages"
      :key="message.id"
      :message
    />
  </ol>
</template>
