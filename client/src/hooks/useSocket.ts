import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

let socket: Socket
export function useSocket() {
  if (!socket)
    socket = io('http://localhost:9000')

  return {
    socket,
  }
}
