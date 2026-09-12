<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { chats } = defineProps<{
  chats: Chat[]
}>()

const { isSidebarOpen } = useSidebarState()

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
    </div>
  </aside>
</template>
