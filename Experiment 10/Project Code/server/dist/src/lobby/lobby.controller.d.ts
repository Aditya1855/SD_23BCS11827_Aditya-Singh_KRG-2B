import { CreateLobbyDto } from './dto/create-lobby.dto';
import { PlayerActionDto } from './dto/player-action.dto';
import { ReadyDto } from './dto/ready.dto';
import { LobbyService } from './lobby.service';
export declare class LobbyController {
    private readonly lobbyService;
    constructor(lobbyService: LobbyService);
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
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    join(id: number, dto: PlayerActionDto): Promise<{
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
    leave(id: number, dto: PlayerActionDto): Promise<{
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
    setReady(id: number, dto: ReadyDto): Promise<{
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
    startGame(id: number, dto: PlayerActionDto): Promise<{
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
