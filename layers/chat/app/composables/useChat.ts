import { requestAddChatMessage, requestAssistantReply, requestGenerateChatTitle } from '../gateways/chat.gateway'
import { useGetChatMessagesQuery } from '../queries/get-chat-messages.query'

const DEFAULT_CHAT_TITLE = 'Untitled Chat'

export const useChat = (chatId: MaybeRefOrGetter<string>) => {
  const { chats, updateChat, addMessage, setMessages } = useChats()

  const chat = computed<Optional<Chat>>(() => (
    chats.value.find(byId(toValue(chatId)))
  ))

  const messages = computed<ChatMessage[]>(() => (
    chat.value
      ? chat.value.messages
      : []
  ))

  const { data, status, execute } = useGetChatMessagesQuery(chatId)

  const getMessages = async () => {
    if (isUndefined(toValue(chat))) return
    if (isNotIdle(status)) return

    await execute()
    setMessages(chat.value!.id, data.value)
  }

  const isStreaming = ref(false)

  const chatTitle = computed(() => chat.value?.title || DEFAULT_CHAT_TITLE)

  const generateChatTitle = async (text: string) => {
    if (isUndefined(chat.value)) return

    const updatedChat = await requestGenerateChatTitle(chat.value.id, { text })

    updateChat(updatedChat)
  }

  const sendMessage = async (text: string) => {
    if (!chat.value) return
    if (isStreaming.value) return

    try {
      if (isEmpty(messages.value)) {
        generateChatTitle(text)
      }

      const message = await requestAddChatMessage(chat.value.id, {
        role: 'user',
        content: text,
      })

      // The server answers 204 (no body) when it doesn't know the chat.
      if (isNullable(message)) throw new Error('Chat not found')

      addMessage(toValue(chatId), message)
      isStreaming.value = true

      const reply = await requestAssistantReply(toValue(chatId))

      if (isUndefined(reply)) throw new Error('No assistant reply was generated')

      addMessage(toValue(chatId), reply)
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
