<script setup lang="ts">
const route = useRoute('projects-projectId')
const projectId = route.params.projectId as string

const { getProjectChats } = useChats()

const chats = getProjectChats(projectId)
</script>

<template>
  <div class="p-px">
    <div
      v-if="chats?.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <NuxtLink
        v-for="chat in chats"
        :key="chat.id"
        :to="{
          name: 'projects-projectId-chats-chatId',
          params: {
            projectId,
            chatId: chat.id,
          },
        }"
      >
        <UCard class="h-full">
          <template #header>
            <h3 class="text-md font-medium">
              {{ chat.title || 'Untitled Chat' }}
            </h3>
          </template>
          <p
            v-if="chat.messages?.length"
            class="text-sm line-clamp-2 text-dimmed"
          >
            {{ chat.messages[chat.messages.length - 1] ?.content }}
          </p>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
