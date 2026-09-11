export async function ensureChatExists(
  chat: MaybeRefOrGetter<Optional<Chat>>,
) {
  if (toValue(chat) === undefined) {
    await navigateTo({
      name: 'index',
      replace: true,
    })
  }
}
