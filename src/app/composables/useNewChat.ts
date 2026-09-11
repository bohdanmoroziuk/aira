export const useNewChat = () => {
  const startNewChat = () => {
    navigateTo({
      name: 'chats-chatId',
      params: {
        chatId: crypto.randomUUID(),
      },
    })
  }

  return {
    startNewChat,
  }
}
