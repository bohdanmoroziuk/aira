<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { Chat } from '~~/src/shared/types/chat'
import { computed, toValue } from 'vue'
import { filterByDateRange, isNonEmpty, isUndefined } from '#imports'

const { chats, open } = defineProps<{
  chats: Chat[]
  open: boolean
}>()

const emit = defineEmits<{
  'create-chat': []
}>()

const toChatMenuItem = (chat: Chat): NavigationMenuItem => {
  return {
    label: chat?.title || 'Untitled chat',
    to: {
      name: 'chats-chatId',
      params: {
        chatId: chat.id,
      },
    },
    exact: true,
    defaultOpen: true,
  }
}

const unassignedChats = computed(() => {
  return chats.filter((chat) => isUndefined(chat.projectId))
})

const filterChats = (startDays: number, endDays?: number) => {
  return filterByDateRange(toValue(unassignedChats), startDays, endDays).map(toChatMenuItem)
}

const chatGroups = computed(() => {
  return [
    {
      label: 'Today',
      menuItems: filterChats(-1, 1),
    },
    {
      label: 'Last week',
      menuItems: filterChats(1, 7),
    },
    {
      label: 'Last month',
      menuItems: filterChats(7, 30),
    },
    {
      label: 'Older',
      menuItems: filterChats(30),
    },
  ].filter((chatGroup) => isNonEmpty(chatGroup.menuItems))
})

const hasChatGroups = computed(() => chatGroups.value.length > 0)
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-muted border-r-default border-r"
    :class="{ '-translate-x-full': !open }"
  >
    <div class="overflow-y-auto p-4">
      <template v-if="hasChatGroups">
        <div
          v-for="chatGroup in chatGroups"
          :key="chatGroup.label"
          class="mb-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h2
              class="text-sm font-semibold text-muted"
            >
              {{ chatGroup.label }}
            </h2>
          </div>
          <UNavigationMenu
            :items="chatGroup.menuItems"
            class="w-full mb-4"
            orientation="vertical"
            default-open
          />
        </div>
      </template>

      <template v-else>
        <UAlert
          title="No chats"
          description="Create a new chat to get started"
          color="neutral"
          variant="soft"
          class="mt-2"
        />
        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-heroicons-plus-small"
          class="mt-2 w-full"
          label="New chat"
          @click="emit('create-chat')"
        />
      </template>
    </div>
  </aside>
</template>
