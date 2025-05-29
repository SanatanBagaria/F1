import { io } from "socket.io-client"
import { SOCKET_EVENTS } from "../utils/socketEvents"

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect(url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001') {
    if (this.socket?.connected) return this.socket

    this.socket = io(url, {
    transports: ['polling'], // ✅ Remove 'websocket' completely
    timeout: 30000,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    forceNew: true
  })

    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('Socket disconnected')
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }
}

export const socketService = new SocketService()
export default SocketService
