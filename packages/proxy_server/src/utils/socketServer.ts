import { Server } from 'socket.io'
import http from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { TProxyInfo } from 'commonTypes/socket'

export default class SocketServer {
  static io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  static register(server: http.Server) {
    this.io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] }
    })
    this.io.on('connection', (socket) => {
      console.log(`Client connected with id: ${socket.id}`)
    })
  }

  //TODO 需要添加userId,定向发送
  static send(eventName: string, data: TProxyInfo) {
    this.io.emit(eventName, data) // 向所有已连接的客户端发送数据
  }

  // 可能需要的资源清理方法
  static close() {
    this.io.close() // 停止接受新的连接，并关闭所有现有的连接
  }
}
