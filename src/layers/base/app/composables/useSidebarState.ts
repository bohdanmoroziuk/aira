import { readonly } from 'vue'
import { useState } from 'nuxt/app'

export const useSidebarState = () => {
  const isSidebarOpen = useState('sidebar-open', () => true)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return {
    isSidebarOpen: readonly(isSidebarOpen),
    toggleSidebar,
  }
}
