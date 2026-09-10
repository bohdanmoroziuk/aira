export const useAutoResizeTextarea = (refKey = 'textareaRef') => {
  const textareaRef = useTemplateRef<HTMLTextAreaElement>(refKey)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.value

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const focusTextarea = () => {
    textareaRef.value?.focus()
  }

  onMounted(focusTextarea)

  return {
    textareaRef,
    adjustTextareaHeight,
    focusTextarea,
  }
}
