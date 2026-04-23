import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LobbyGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('join_lobby_room')
  joinLobbyRoom(
    @MessageBody() payload: { lobbyId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(this.roomName(payload.lobbyId));
  }

  @SubscribeMessage('leave_lobby_room')
  leaveLobbyRoom(
    @MessageBody() payload: { lobbyId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(this.roomName(payload.lobbyId));
  }

  emitLobbyEvent(lobbyId: number, event: string, payload: unknown) {
    this.server.to(this.roomName(lobbyId)).emit(event, payload);
  }

  emitGlobal(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }

  private roomName(lobbyId: number) {
    return `lobby:${lobbyId}`;
  }
}
