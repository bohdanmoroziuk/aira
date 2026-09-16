import type { MaybeRefOrGetter } from 'vue'
import type { Chat, ChatMessage, ChatRole } from '../../shared/types/chat.types'
import type { Optional } from '../../../base/shared/types/common.types'
import { computed, ref, toValue } from 'vue'
import { requestAssistantReply } from '../gateways/ai.gateway'
import { generateUuid, byId } from '#imports'
import { useChats } from './useChats'

const DEFAULT_CHAT_TITLE = 'Untitled Chat'

export const useChat = (chatId: MaybeRefOrGetter<string>) => {
  const { chats, addMessage } = useChats()

  const chat = computed<Optional<Chat>>(() => (
    chats.value.find(byId(toValue(chatId)))
  ))

  const messages = computed<ChatMessage[]>(() => (
    chat.value
      ? chat.value.messages
      : []
  ))
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
    messages,
    addMessage,
    // TODO: return readonly(isStreaming) so consumers can't flip it.
    isStreaming,
    sendMessage,
  }
}
