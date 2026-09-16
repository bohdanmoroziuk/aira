<script setup lang="ts">
import { useAppConfig } from '#imports'
import { useChats } from '../composables/useChats'
import { useSidebarState } from '../../../base/app/composables/useSidebarState'

const appConfig = useAppConfig()
const { startNewChat } = useChats()
const { toggleSidebar } = useSidebarState()
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-default bg-muted px-4"
  >
    <div class="flex items-center gap-4">
      <UButton
        icon="i-lucide-menu"
        color="primary"
        variant="ghost"
        @click="toggleSidebar"
      />

      <UButton
        icon="i-lucide-plus"
        label="New chat"
        @click="startNewChat()"
      />
    </div>
    <h1 class="text-lg font-semibold">
      {{ appConfig.title }}
    </h1>
    <div />
  </header>
</template>
