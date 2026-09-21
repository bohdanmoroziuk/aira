<script setup lang="ts">
const appConfig = useAppConfig()
const { getChats } = useChats()

await getChats()

useHead({
  titleTemplate: (title) => (
    title
      ? `${title} - ${appConfig.title}`
      : appConfig.title
  ),
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
