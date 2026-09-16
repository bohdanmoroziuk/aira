import type { Chat, ChatMessage } from '../../shared/types/chat.types'
import { navigateTo, useState, generateUuid, byProp } from '#imports'

type CreateChatOptions = Pick<Chat, 'projectId'>

export const useChats = () => {
  const chats = useState<Chat[]>('chats', () => [])

  const createChat = (options: CreateChatOptions = {}) => {
    const chat = {
      id: generateUuid(),
      title: 'New chat',
      messages: [],
      projectId: options.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    chats.value.push(chat)

    return chat
  }

  const getProjectChats = (projectId: string) => {
    return chats.value.filter(byProp('projectId', projectId))
  }

  const startNewChat = async (options: CreateChatOptions = {}) => {
    const chat = createChat(options)

    const chatTo = chat.projectId
      ? {
          name: 'projects-projectId-chats-chatId',
          params: {
            projectId: chat.projectId,
            chatId: chat.id,
          },
        }
      : {
          name: 'chats-chatId',
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

  return {
    chats,
    createChat,
    getProjectChats,
    startNewChat,
    addMessage,
  }
}
