<script setup lang="ts">
const props = defineProps<{
  message: ChatMessage
}>()

const messageStyle = computed(() => {
  const styleMap: Record<ChatRole, string> = {
    user: 'self-end w-[70%] p-4 bg-muted border border-default',
    system: 'w-full py-4 bg-transparent',
    assistant: 'w-full py-4 bg-transparent',
  }

  return styleMap[props.message.role]
})
</script>

<template>
  <li
    class="rounded-(--ui-radius) transition-all duration-200"
    :class="messageStyle"
  >
    <div class="text-default whitespace-pre-wrap wrap-break-word">
      <MarkdownRenderer :content="message.content" />
    </div>
  </li>
</template>
