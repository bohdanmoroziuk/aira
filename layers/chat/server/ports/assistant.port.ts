export type Assistant = {
  generateReply: (messages: ChatMessage[]) => Promise<string>
}
