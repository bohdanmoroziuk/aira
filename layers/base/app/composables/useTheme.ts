const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
} as const

export const useTheme = () => {
  const colorMode = useColorMode()

  const isDark = computed(() => {
    return colorMode.value === THEME.DARK
  })

  const toggleTheme = () => {
    colorMode.preference = isDark.value ? THEME.LIGHT : THEME.DARK
  }

  return {
    isDark,
    toggleTheme,
  }
}
