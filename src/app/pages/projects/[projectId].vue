<script setup lang="ts">
import { computed, ref, toValue, useChats, useProject } from '#imports'
import { useRoute } from 'vue-router'
import { ensureProjectExists } from '~/guards/project-exists.guard'

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const { project, updateProject } = useProject(projectId)
const { startNewChat } = useChats()

await ensureProjectExists(project)

const onChatPage = computed(() => route.params.chatId)
const isEditing = ref(false)
const editedName = ref('')

const startEditing = () => {
  if (!project.value || onChatPage.value) return

  editedName.value = project.value.name
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  editedName.value = ''
}

const handleProjectRename = async () => {
  if (!editedName.value.trim() || !project.value) return
  if (editedName.value.trim() === project.value.name) return

  isEditing.value = false
  try {
    await updateProject({ name: editedName.value.trim() })
  } catch (error) {
    console.error('Failed to rename project:', error)
  }
}

async function handleNewChat() {
  try {
    await startNewChat({ projectId: toValue(projectId) })
  } catch (error) {
    console.error('Failed to create new chat:', error)
  }
}
</script>

<template>
  <div class="p-4 h-[calc(100%-4rem)]">
    <div
      v-if="project"
      class="flex items-start justify-between mb-6 pb-4 border-b border-default"
    >
      <div>
        <div class="flex items-center gap-2">
          <h1
            v-if="!isEditing"
            class="text-2xl font-bold flex items-center gap-2 group"
            :class="{ 'cursor-pointer': !onChatPage }"
            @click="startEditing"
          >
            {{ project.name }}
            <UIcon
              v-if="!onChatPage"
              name="i-heroicons-pencil"
              class="w-4 h-4 opacity-0 ml-1 transition-opacity group-hover:opacity-100"
            />
          </h1>
          <div
            v-else
            class="flex items-center gap-2"
          >
            <UInput
              v-model="editedName"
              class="text-2xl font-normal h-auto w-auto min-w-50 py-1 pr-2 pl-0"
              size="lg"
              autofocus
              @keyup.enter="handleProjectRename"
              @keyup.esc="cancelEditing"
            />
            <div class="flex gap-1">
              <UButton
                color="neutral"
                variant="soft"
                icon="i-heroicons-x-mark"
                size="xs"
                @click="cancelEditing"
              />
              <UButton
                color="primary"
                variant="soft"
                icon="i-heroicons-check"
                size="xs"
                @click="handleProjectRename"
              />
            </div>
          </div>
        </div>

        <NuxtLink
          v-if="onChatPage"
          :to="`/projects/${projectId}`"
          class="leading-4 flex items-center mt-1 text-sm text-muted"
        >
          <UIcon
            name="i-heroicons-arrow-left"
            class="mr-1"
          />
          Back to Project
        </NuxtLink>
      </div>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        @click="handleNewChat"
      >
        New Chat in Project
      </UButton>
    </div>

    <NuxtPage />
  </div>
</template>
