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

  const createMessage = (text: string, role: ChatRole): ChatMessage => {
    return {
      id: generateUuid(),
      role,
      content: text,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  const sendMessage = async (text: string) => {
    if (!chat.value) return
    if (isStreaming.value) return

    addMessage(toValue(chatId), createMessage(text, 'user'))
    isStreaming.value = true

    try {
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
