import { requestAssistantReply } from '../gateways/ai.gateway'

const DEFAULT_CHAT_TITLE = 'Untitled Chat'

export const useChat = (chatId: MaybeRefOrGetter<string>) => {
  const { chats, addMessage, setMessages } = useChats()

  const chat = computed<Optional<Chat>>(() => (
    chats.value.find(byId(toValue(chatId)))
  ))

  const messages = computed<ChatMessage[]>(() => (
    chat.value
      ? chat.value.messages
      : []
  ))

  const { data, status, execute } = useFetch<ChatMessage[]>(`/api/chats/${toValue(chatId)}/messages`, {
    default: () => [],
    immediate: false,
  })

  const getMessages = async () => {
    if (isUndefined(toValue(chat))) return
    if (status.value !== 'idle') return

    await execute()
    setMessages(chat.value!.id, data.value)
  }

  const isStreaming = ref(false)

  const chatTitle = computed(() => chat.value?.title || DEFAULT_CHAT_TITLE)

  const sendMessage = async (text: string) => {
    if (!chat.value) return
    if (isStreaming.value) return

    try {
      const message = await $fetch<ChatMessage>(`/api/chats/${chat.value.id}/messages`, {
        method: 'post',
        body: {
          role: 'user',
          content: text,
        },
      })

      addMessage(toValue(chatId), message)
      isStreaming.value = true

      const data = await requestAssistantReply(messages.value)

      addMessage(toValue(chatId), data)
    } catch (error) {
      // TODO: surface the failure to the user (toast / inline error message)
      //       and decide whether to keep or roll back the optimistic message.
      console.error('Failed to send message', error)
    } finally {
      isStreaming.value = false
    }
  }

  return {
    chat,
    chatTitle,
    // TODO: return readonly(isStreaming) so consumers can't flip it.
    isStreaming,
    messages,
    addMessage,
    sendMessage,
    getMessages,
  }
}
