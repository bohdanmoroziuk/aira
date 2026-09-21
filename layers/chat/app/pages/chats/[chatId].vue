<script setup lang="ts">
import { ensureChatExists } from '../../guards/chat-exists.guard'

const toast = useToast()
const route = useRoute('chats-chatId')
const chatId = route.params.chatId as string
const { chat, chatTitle, messages, isStreaming, sendMessage } = useChat(chatId)

await ensureChatExists(chat)

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
    :title="chatTitle"
    :messages
    :is-streaming
    @send-message="handleMessageSend"
  />
</template>
