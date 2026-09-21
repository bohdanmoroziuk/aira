export type Assistant = {
  generateReply: (messages: ChatMessage[]) => Promise<string>
  generateTitle: (message: string) => Promise<string>
}
