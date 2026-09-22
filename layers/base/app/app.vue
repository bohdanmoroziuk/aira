<script setup lang="ts">
const appConfig = useAppConfig()
const { getChats } = useChats()
const { getProjects } = useProjects()

await Promise.all([
  getChats(),
  getProjects(),
])

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
