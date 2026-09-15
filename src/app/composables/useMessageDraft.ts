import { computed, ref } from 'vue'

export const useMessageDraft = () => {
  const text = ref('')

  const noText = computed(() => text.value.trim().length === 0)

  const resetText = () => {
    text.value = ''
  }

  return {
    text,
    noText,
    resetText,
  }
}
