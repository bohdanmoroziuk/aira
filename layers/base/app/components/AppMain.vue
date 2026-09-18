<script setup lang="ts">
const { isSidebarOpen } = useSidebarState()
</script>

<template>
  <main
    class="h-full mt-16 transition-all duration-300 ease-in-out"
    :class="{
      'ml-64': isSidebarOpen,
    }"
  >
    <slot />
  </main>
</template>
