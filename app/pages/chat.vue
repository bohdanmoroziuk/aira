<script setup lang="ts">
const { chat, chatTitle, messages, isStreaming, sendMessage } = useChat()

useHead({
  title: chatTitle.value,
})
</script>

<template>
  <ChatWindow :chat :messages :is-streaming @send-message="sendMessage" />
</template>
