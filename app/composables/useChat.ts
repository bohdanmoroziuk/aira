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

const MOCK_CHAT: Chat = {
  id: '1',
  title: 'Nuxt.js project help',
  messages: [...MOCK_MESSAGES],
}

export const useChat = () => {
  const chat = ref<Chat>(MOCK_CHAT)
  const messages = computed<ChatMessage[]>(() => chat.value.messages)

  const createMessage = (text: string, role: ChatRole): ChatMessage => {
    return {
      id: crypto.randomUUID(),
      role,
      content: text,
    }
  }

  const sendMessage = async (text: string) => {
    messages.value.push(createMessage(text, 'user'))

    await sleep(200)

    messages.value.push(createMessage(`You said: ${text}`, 'assistant'))
  }

  return {
    chat,
    messages,
    sendMessage,
  }
}
