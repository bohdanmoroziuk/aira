<script setup lang="ts">
const toast = useToast()
const { chat, chatTitle, messages, isStreaming, sendMessage } = useChat()

const handleMessageSend = async (text: string) => {
  try {
    await sendMessage(text)
  } catch (error) {
    toast.add({
      title: (error as Error).message,
      color: 'error',
    })
  }
}

useHead({
  title: chatTitle,
})
</script>

<template>
  <ChatWindow
    :chat
    :messages
    :is-streaming
    @send-message="handleMessageSend"
  />
</template>
