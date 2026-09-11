export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

export type Chat = {
  id: string
  title: string
  messages: ChatMessage[]
}
