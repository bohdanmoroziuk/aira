<script setup lang="ts">
import { ensureChatBelongsToProject } from '../../../../guards/chat-belongs-to-project.guard'
import { ensureChatExists } from '../../../../guards/chat-exists.guard'

const appConfig = useAppConfig()
const route = useRoute('projects-projectId-chats-chatId')
const projectId = computed(() => route.params.projectId as string)
const chatId = computed(() => route.params.chatId as string)
const { chat, chatTitle, messages, isStreaming, sendMessage, getMessages } = useChat(chatId)

await ensureChatExists(chat)
await ensureChatBelongsToProject(chat, projectId)
await getMessages()

const title = computed(() =>
  chat.value?.title
    ? `${chat.value.title} - ${appConfig.title}`
    : appConfig.title,
)

useHead({
  title,
})
</script>

<template>
  <ChatWindow
    :title="chatTitle"
    :is-streaming
    :messages
    @send-message="sendMessage"
  />
</template>
