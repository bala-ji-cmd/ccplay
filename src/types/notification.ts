export interface Notification {
  id: string
  type: "warning" | "info" | "error"
  message: string
  timestamp: string
  isRead: boolean
} 