import { Server } from 'socket.io'
import http from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { TProxyInfo } from 'commonTypes/socket'

export default class SocketServer {
  static io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  //TODO: token重新生成，比如用户重新登录，这块怎么清理呢？
  static proxyClientTokenWithSocketId: Map<string, string> = new Map()

  static register(server: http.Server) {
    this.io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] }
    })
    this.io.on('connection', (socket) => {
      const proxyClientToken = socket.handshake.auth.token
      this.proxyClientTokenWithSocketId.set(proxyClientToken, socket.id)
    })
  }

  static send(eventName: string, token: string, data: TProxyInfo) {
    const socketId = this.proxyClientTokenWithSocketId.get(token)
    if (socketId) {
      this.io.to(socketId).emit(eventName, data) // 向对应的客户端发送数据
    }
  }

  // 可能需要的资源清理方法
  //TODO 清理方法可能不对
  static close(socketId: string) {
    if (socketId) {
      this.io.sockets.sockets.get(socketId)?.disconnect() // 断开指定socket连接
    } else {
      this.io.close() // 停止接受新的连接，并关闭所有现有的连接
    }
  }
}
