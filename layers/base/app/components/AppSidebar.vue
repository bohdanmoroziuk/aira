<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { isSidebarOpen } = useSidebarState()
const { chats, startNewChat } = useChats()
const { projects, createProject } = useProjects()

const route = useRoute()
const projectId = computed(() => (
  'projectId' in route.params
    ? route.params.projectId as string
    : undefined
))

const isCurrentProject = (id: string) => {
  return projectId.value === id
}

const currentProjectChats = computed(() => {
  return projectId.value
    ? chats.value.filter(byProp('projectId', projectId.value))
    : []
})

const toProjectChatMenuItem = (project: Project, chat: Chat): NavigationMenuItem => {
  return {
    label: chat?.title ?? 'Untitled chat',
    to: {
      name: 'projects-projectId-chats-chatId',
      params: {
        projectId: project.id,
        chatId: chat.id,
      },
    },
    exact: true,
    defaultOpen: false,
  }
}

const toProjectMenuItem = (project: Project): NavigationMenuItem => {
  const isCurrent = isCurrentProject(project.id)

  return {
    label: project.name,
    to: {
      name: 'projects-projectId',
      params: {
        projectId: project.id,
      },
    },
    exact: true,
    defaultOpen: isCurrent,
    children: isCurrent
      ? currentProjectChats.value.map((chat) => toProjectChatMenuItem(project, chat))
      : [],
  }
}

const projectMenuItems = computed(() => {
  return projects.value.map(toProjectMenuItem)
})

const hasProjects = computed(() => {
  return isNonEmpty(projects.value)
})

const handleProjectCreate = async () => {
  const project = createProject()

  await startNewChat({ projectId: project.id })
}

const toChatMenuItem = (chat: Chat): NavigationMenuItem => {
  return {
    label: chat?.title || 'Untitled chat',
    to: {
      name: 'chats-chatId',
      params: {
        chatId: chat.id,
      },
    },
    exact: true,
    defaultOpen: true,
  }
}

const unassignedChats = computed(() => {
  return chats.value.filter((chat) => isUndefined(chat.projectId))
})

const filterChats = (startDays: number, endDays?: number) => {
  return filterByDateRange(toValue(unassignedChats), startDays, endDays).map(toChatMenuItem)
}

const chatGroups = computed(() => {
  return [
    {
      label: 'Today',
      menuItems: filterChats(-1, 1),
    },
    {
      label: 'Last week',
      menuItems: filterChats(1, 7),
    },
    {
      label: 'Last month',
      menuItems: filterChats(7, 30),
    },
    {
      label: 'Older',
      menuItems: filterChats(30),
    },
  ].filter((chatGroup) => isNonEmpty(chatGroup.menuItems))
})

const hasChatGroups = computed(() => chatGroups.value.length > 0)
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-muted border-r-default border-r"
    :class="{ '-translate-x-full': !isSidebarOpen }"
  >
    <template v-if="hasProjects">
      <div class="mb-4 overflow-auto p-4 border-b border-default">
        <div class="flex justify-between items-center mb-2">
          <h2
            class="text-sm font-semibold text-muted"
          >
            Projects
          </h2>
        </div>
        <UNavigationMenu
          :items="projectMenuItems"
          class="w-full mb-4"
          orientation="vertical"
          default-open
        />
        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-heroicons-plus-small"
          class="mt-2 w-full"
          label="New project"
          @click="handleProjectCreate"
        />
      </div>
    </template>

    <div class="overflow-y-auto p-4">
      <template v-if="hasChatGroups">
        <div
          v-for="chatGroup in chatGroups"
          :key="chatGroup.label"
          class="mb-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h2
              class="text-sm font-semibold text-muted"
            >
              {{ chatGroup.label }}
            </h2>
          </div>
          <UNavigationMenu
            :items="chatGroup.menuItems"
            class="w-full mb-4"
            orientation="vertical"
            default-open
          />
        </div>
      </template>

      <template v-else>
        <UAlert
          title="No chats"
          description="Create a new chat to get started"
          color="neutral"
          variant="soft"
          class="mt-2"
        />
      </template>

      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        label="New chat"
        @click="() => startNewChat()"
      />
    </div>
  </aside>
</template>
