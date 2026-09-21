<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

const switchIcon = computed(() => {
  return isDark.value ? 'i-lucide-moon' : 'i-lucide-sun'
})

const switchAriaLabel = computed(() => {
  return `Switch to ${isDark.value ? 'light' : 'dark'} mode`
})
</script>

<template>
  <ClientOnly>
    <template #default>
      <UButton
        :icon="switchIcon"
        :aria-label="switchAriaLabel"
        color="neutral"
        variant="ghost"
        @click="toggleTheme"
      />
    </template>

    <template #placeholder>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
