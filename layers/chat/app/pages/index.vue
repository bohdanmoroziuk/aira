<script setup lang="ts">
const appConfig = useAppConfig()
const { startNewChat } = useChats()
</script>

<template>
  <UContainer class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1 class="text-2xl font-bold mb-2">
      {{ appConfig.title }}
    </h1>

    <UButton @click="startNewChat()">
      Start a new chat
    </UButton>
  </UContainer>
</template>
