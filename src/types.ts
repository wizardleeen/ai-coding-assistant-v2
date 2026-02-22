export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
}

export interface Message {
  id: string
  type: 'user' | 'system' | 'ai'
  content: string
  timestamp: Date
}