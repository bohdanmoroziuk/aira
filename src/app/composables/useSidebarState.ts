export const useSidebarState = () => {
  const isSidebarOpen = useState('sidebar-open', () => true)

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return {
    isSidebarOpen,
    toggleSidebar,
  }
}
