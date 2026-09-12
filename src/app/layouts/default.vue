<script setup lang="ts">
const { chats, startNewChat } = useChats()
const { isSidebarOpen } = useSidebarState()
</script>

<template>
  <div class="h-[calc(100vh-4rem)] bg-default">
    <AppHeader />
    <AppSidebar
      :chats
      @create-chat="startNewChat"
    />
    <main
      class="h-full mt-16 transition-all duration-300 ease-in-out"
      :class="{
        'ml-64': isSidebarOpen,
      }"
    >
      <slot />
    </main>
  </div>
</template>
