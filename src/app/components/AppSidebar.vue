<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { chats } = defineProps<{
  chats: Chat[]
}>()

const emit = defineEmits<{
  'create-chat': []
}>()

const { isSidebarOpen } = useSidebarState()

const hasChats = computed(() => chats.length > 0)

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

const chatMenuItems = computed(() => (
  chats.map(toChatMenuItem)
))
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-muted border-r-default border-r"
    :class="{ '-translate-x-full': !isSidebarOpen }"
  >
    <div class="overflow-y-auto p-4">
      <template v-if="hasChats">
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <h2
              class="text-sm font-semibold text-muted"
            >
              Chats
            </h2>
          </div>
          <UNavigationMenu
            :items="chatMenuItems"
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
