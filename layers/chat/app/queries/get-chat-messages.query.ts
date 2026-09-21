import { requestChatMessages } from '../gateways/chat.gateway'

export const useGetChatMessagesQuery = (chatId: MaybeRefOrGetter<string>) =>
  useAsyncData(
    `chat-messages-${toValue(chatId)}`,
    () => requestChatMessages(toValue(chatId)),
    {
      immediate: false,
      default: () => [],
    },
  )
