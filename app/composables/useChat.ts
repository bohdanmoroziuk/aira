const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello, can you help me with my Nuxt.js project?',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      "Of course! I'd be happy to help with your Nuxt.js project. What specific questions or issues do you have?",
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I implement server-side rendering?',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      "Nuxt.js provides server-side rendering out of the box! You don't need to do any special configuration for basic SSR. If you need specific optimizations, we can discuss those in detail.",
  },
]

// TODO: replace the mock chat/messages with a real data source (API / store).
const MOCK_CHAT: Chat = {
  id: '1',
  title: 'Nuxt.js project help',
  messages: [...MOCK_MESSAGES],
}

const DEFAULT_CHAT_TITLE = 'Untitled Chat'

export const useChat = () => {
  // FIXME: fresh state per call — not shared between consumers. Back it with
  //        useState (or a store) so a sidebar / header sees the same chat.
  const chat = ref<Chat>(MOCK_CHAT)
  const messages = computed<ChatMessage[]>(() => chat.value.messages)
  const isStreaming = ref(false)

  const chatTitle = computed(() => chat.value?.title || DEFAULT_CHAT_TITLE)

  const createMessage = (text: string, role: ChatRole): ChatMessage => {
    return {
      id: crypto.randomUUID(),
      role,
      content: text,
    }
  }

  const addMessage = (message: ChatMessage): ChatMessage => {
    chat.value.messages.push(message)
    return message
  }

  const sendMessage = async (text: string) => {
    if (isStreaming.value) return

    addMessage(createMessage(text, 'user'))
    isStreaming.value = true

    try {
      const data = await requestAssistantReply(messages.value)

      addMessage(data)
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
    messages,
    addMessage,
    // TODO: return readonly(isStreaming) so consumers can't flip it.
    isStreaming,
    sendMessage,
  }
}
