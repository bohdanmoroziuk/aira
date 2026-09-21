import { requestCreateChat } from '../gateways/chat.gateway'
import { useGetChatsQuery } from '../queries/get-chats.query'

type CreateChatOptions = Pick<Chat, 'projectId'>

export const useChats = () => {
  const chats = useState<Chat[]>('chats', () => [])

  const { data, execute, status } = useGetChatsQuery()

  const getChats = async () => {
    if (status.value === 'idle') {
      await execute()
      chats.value = data.value
    }
  }

  const createChat = async (options: CreateChatOptions = {}) => {
    const chat = await requestCreateChat(options.projectId)

    chats.value.push(chat)

    return chat
  }

  const getProjectChats = (projectId: string) => {
    return chats.value.filter(byProp('projectId', projectId))
  }

  const startNewChat = async (options: CreateChatOptions = {}) => {
    const chat = await createChat(options)

    const chatTo = chat.projectId
      ? {
          name: 'projects-projectId-chats-chatId' as const,
          params: {
            projectId: chat.projectId,
            chatId: chat.id,
          },
        }
      : {
          name: 'chats-chatId' as const,
          params: {
            chatId: chat.id,
          },
        }

    await navigateTo(chatTo)
  }

  const addMessage = (chatId: string, message: ChatMessage) => {
    chats.value = chats.value.map((chat) => (
      chat.id === chatId
        ? {
            ...chat,
            messages: [
              ...chat.messages,
              message,
            ],
            updatedAt: new Date(),
          }
        : chat
    ))

    return message
  }

  const setMessages = (chatId: string, messages: ChatMessage[]) => {
    chats.value = chats.value.map((chat) => {
      return chat.id === chatId
        ? {
            ...chat,
            messages,
          }
        : chat
    })
  }

  return {
    chats,
    getChats,
    createChat,
    getProjectChats,
    startNewChat,
    addMessage,
    setMessages,
  }
}
