import { requestChats } from '../gateways/chat.gateway'

export const useGetChatsQuery = () =>
  useAsyncData(
    'chats',
    requestChats,
    {
      immediate: false,
      default: () => [],
    },
  )
