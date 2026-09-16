<script setup lang="ts">
import { computed, useAppConfig, useChat, useHead } from '#imports'
import { useRoute } from 'vue-router'
import { ensureChatBelongsToProject } from '../../../../guards/chat-belongs-to-project.guard'
import { ensureChatExists } from '../../../../guards/chat-exists.guard'

const appConfig = useAppConfig()
const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
const chatId = computed(() => route.params.chatId as string)
const { chat, messages, isStreaming, sendMessage } = useChat(chatId)

await ensureChatExists(chat)
ensureChatBelongsToProject(chat, projectId)

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
    :is-streaming
    :chat="chat!"
    :messages
    @send-message="sendMessage"
  />
</template>
