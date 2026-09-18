<script setup lang="ts">
const appConfig = useAppConfig()

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
