import { Server, Socket } from 'socket.io';
export declare class LobbyGateway {
    server: Server;
    joinLobbyRoom(payload: {
        lobbyId: number;
    }, client: Socket): void;
    leaveLobbyRoom(payload: {
        lobbyId: number;
    }, client: Socket): void;
    emitLobbyEvent(lobbyId: number, event: string, payload: unknown): void;
    emitGlobal(event: string, payload: unknown): void;
    private roomName;
}
