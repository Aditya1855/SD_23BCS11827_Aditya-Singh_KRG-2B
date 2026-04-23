import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LobbyGateway } from '../websocket/lobby.gateway';
import { CreateLobbyDto } from './dto/create-lobby.dto';
export declare class LobbyService {
    private readonly prisma;
    private readonly lobbyGateway;
    constructor(prisma: PrismaService, lobbyGateway: LobbyGateway);
    private createLobbyCode;
    private uniqueLobbyCode;
    create(dto: CreateLobbyDto): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    findAll(): Prisma.PrismaPromise<({
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    })[]>;
    findById(id: number): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    findByCode(code: string): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    findMembers(id: number): Promise<({
        player: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        playerId: number;
        isReady: boolean;
        joinedAt: Date;
        lobbyId: number;
    })[]>;
    join(lobbyId: number, playerId: number): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    leave(lobbyId: number, playerId: number): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    setReady(lobbyId: number, playerId: number, isReady: boolean): Promise<{
        hostPlayer: {
            id: number;
            username: string;
            email: string | null;
            status: import("@prisma/client").$Enums.PlayerStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        members: ({
            player: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: number;
            playerId: number;
            isReady: boolean;
            joinedAt: Date;
            lobbyId: number;
        })[];
    } & {
        id: number;
        status: import("@prisma/client").$Enums.LobbyStatus;
        createdAt: Date;
        updatedAt: Date;
        lobbyCode: string;
        lobbyName: string;
        gameMode: string;
        maxPlayers: number;
        isPrivate: boolean;
        hostPlayerId: number;
    }>;
    startGame(lobbyId: number, playerId: number): Promise<{
        updatedLobby: {
            hostPlayer: {
                id: number;
                username: string;
                email: string | null;
                status: import("@prisma/client").$Enums.PlayerStatus;
                createdAt: Date;
                updatedAt: Date;
            };
            members: ({
                player: {
                    id: number;
                    username: string;
                    email: string | null;
                    status: import("@prisma/client").$Enums.PlayerStatus;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: number;
                playerId: number;
                isReady: boolean;
                joinedAt: Date;
                lobbyId: number;
            })[];
        } & {
            id: number;
            status: import("@prisma/client").$Enums.LobbyStatus;
            createdAt: Date;
            updatedAt: Date;
            lobbyCode: string;
            lobbyName: string;
            gameMode: string;
            maxPlayers: number;
            isPrivate: boolean;
            hostPlayerId: number;
        };
        gameSession: {
            id: number;
            status: string;
            createdAt: Date;
            lobbyId: number;
            sessionCode: string;
        };
    }>;
}
