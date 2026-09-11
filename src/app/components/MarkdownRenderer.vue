<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <Suspense>
    <MDC
      :value="content"
      class="markdown-content"
    />

    <template #fallback>
      <div class="markdown-content">
        {{ content }}
        <span
          role="status"
          class="ml-2 inline-flex align-middle"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="size-4 shrink-0 animate-spin text-muted"
            aria-hidden="true"
          />
          <span class="sr-only">Rendering message</span>
        </span>
      </div>
    </template>
  </Suspense>
</template>

<style>
@reference '~/assets/css/main.css';

.markdown-content {
  @apply text-base;
}

.markdown-content p {
  @apply text-base leading-normal mb-4;
}

.markdown-content p:last-child {
  @apply mb-0;
}

.markdown-content h1 {
  @apply text-3xl font-bold mt-8 mb-5 text-(--ui-text-highlighted);
}

.markdown-content h2 {
  @apply text-2xl font-semibold mt-7 mb-4 text-(--ui-text-highlighted);
}

.markdown-content h3 {
  @apply text-xl font-semibold mt-6 mb-3 text-(--ui-text-highlighted);
}

.markdown-content pre {
  @apply text-sm bg-(--ui-bg-inverted) text-white p-4 rounded-(--ui-radius) overflow-x-auto my-6;
}

.markdown-content code {
  @apply text-sm bg-(--ui-bg-muted) text-(--ui-text) px-1 py-0.5 rounded-(--ui-radius);
}

.markdown-content pre code {
  @apply bg-transparent text-white p-0;
}

.markdown-content ul,
.markdown-content ol {
  @apply text-base mt-4 mb-6 ml-6 list-outside text-(--ui-text);
}

.markdown-content ul {
  @apply list-disc;
}

.markdown-content ol {
  @apply list-decimal;
}

.markdown-content li {
  @apply my-2;
}

.markdown-content li > p {
  @apply my-2;
}

.markdown-content blockquote {
  @apply border-l-4 border-(--ui-border) pl-4 my-6 text-(--ui-text-muted) italic;
}

.markdown-content hr {
  @apply border-0 border-t border-(--ui-border) my-8;
}

.markdown-content table {
  @apply w-full my-6 border-collapse;
}

.markdown-content th,
.markdown-content td {
  @apply p-3 border border-(--ui-border) text-left;
}

.markdown-content th {
  @apply bg-(--ui-bg-muted) font-semibold;
}

.markdown-content > :first-child {
  @apply mt-0;
}

.markdown-content a {
  @apply text-(--ui-primary) underline underline-offset-2;
}

.markdown-content a:hover {
  @apply text-(--ui-color-primary-600);
}

.markdown-content img {
  @apply max-w-full h-auto my-6 rounded-(--ui-radius);
}
</style>
