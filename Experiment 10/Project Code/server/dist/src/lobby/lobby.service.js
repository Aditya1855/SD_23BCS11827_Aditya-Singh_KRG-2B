"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const lobby_gateway_1 = require("../websocket/lobby.gateway");
const lobbyInclude = {
    members: {
        include: {
            player: true,
        },
        orderBy: { joinedAt: 'asc' },
    },
    hostPlayer: true,
};
let LobbyService = class LobbyService {
    prisma;
    lobbyGateway;
    constructor(prisma, lobbyGateway) {
        this.prisma = prisma;
        this.lobbyGateway = lobbyGateway;
    }
    createLobbyCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
    async uniqueLobbyCode() {
        for (let i = 0; i < 10; i += 1) {
            const code = this.createLobbyCode();
            const exists = await this.prisma.lobby.findUnique({ where: { lobbyCode: code } });
            if (!exists)
                return code;
        }
        throw new common_1.BadRequestException('Could not generate unique lobby code');
    }
    async create(dto) {
        const host = await this.prisma.player.findUnique({ where: { id: dto.hostPlayerId } });
        if (!host)
            throw new common_1.NotFoundException('Host player not found');
        const lobbyCode = await this.uniqueLobbyCode();
        const lobby = await this.prisma.$transaction(async (tx) => {
            const created = await tx.lobby.create({
                data: {
                    lobbyCode,
                    hostPlayerId: dto.hostPlayerId,
                    lobbyName: dto.lobbyName,
                    gameMode: dto.gameMode,
                    maxPlayers: dto.maxPlayers,
                    status: client_1.LobbyStatus.OPEN,
                    isPrivate: dto.isPrivate ?? false,
                    members: {
                        create: {
                            playerId: dto.hostPlayerId,
                            isReady: false,
                        },
                    },
                },
                include: lobbyInclude,
            });
            return created;
        });
        this.lobbyGateway.emitGlobal('lobby_created', lobby);
        this.lobbyGateway.emitLobbyEvent(lobby.id, 'lobby_updated', lobby);
        return lobby;
    }
    findAll() {
        return this.prisma.lobby.findMany({ include: lobbyInclude, orderBy: { createdAt: 'desc' } });
    }
    async findById(id) {
        const lobby = await this.prisma.lobby.findUnique({ where: { id }, include: lobbyInclude });
        if (!lobby)
            throw new common_1.NotFoundException('Lobby not found');
        return lobby;
    }
    async findByCode(code) {
        const lobby = await this.prisma.lobby.findUnique({ where: { lobbyCode: code }, include: lobbyInclude });
        if (!lobby)
            throw new common_1.NotFoundException('Lobby not found');
        return lobby;
    }
    async findMembers(id) {
        const lobby = await this.findById(id);
        return lobby.members;
    }
    async join(lobbyId, playerId) {
        const player = await this.prisma.player.findUnique({ where: { id: playerId } });
        if (!player)
            throw new common_1.NotFoundException('Player not found');
        const lobby = await this.findById(lobbyId);
        if (lobby.status !== client_1.LobbyStatus.OPEN) {
            throw new common_1.BadRequestException('Lobby is not open for joining');
        }
        if (lobby.members.length >= lobby.maxPlayers) {
            throw new common_1.BadRequestException('Lobby is full');
        }
        if (lobby.members.some((member) => member.playerId === playerId)) {
            throw new common_1.BadRequestException('Player is already in this lobby');
        }
        const updatedLobby = await this.prisma.$transaction(async (tx) => {
            await tx.lobbyMember.create({ data: { lobbyId, playerId } });
            const memberCount = await tx.lobbyMember.count({ where: { lobbyId } });
            const status = memberCount >= lobby.maxPlayers ? client_1.LobbyStatus.FULL : client_1.LobbyStatus.OPEN;
            return tx.lobby.update({
                where: { id: lobbyId },
                data: { status },
                include: lobbyInclude,
            });
        });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'player_joined', { lobbyId, player });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'lobby_updated', updatedLobby);
        return updatedLobby;
    }
    async leave(lobbyId, playerId) {
        const lobby = await this.findById(lobbyId);
        const member = lobby.members.find((m) => m.playerId === playerId);
        if (!member)
            throw new common_1.BadRequestException('Player is not a lobby member');
        const result = await this.prisma.$transaction(async (tx) => {
            await tx.lobbyMember.delete({ where: { id: member.id } });
            const remainingMembers = await tx.lobbyMember.findMany({
                where: { lobbyId },
                orderBy: { joinedAt: 'asc' },
            });
            if (remainingMembers.length === 0) {
                return tx.lobby.update({
                    where: { id: lobbyId },
                    data: { status: client_1.LobbyStatus.CLOSED },
                    include: lobbyInclude,
                });
            }
            const nextHostId = lobby.hostPlayerId === playerId ? remainingMembers[0].playerId : lobby.hostPlayerId;
            const status = remainingMembers.length >= lobby.maxPlayers ? client_1.LobbyStatus.FULL : client_1.LobbyStatus.OPEN;
            return tx.lobby.update({
                where: { id: lobbyId },
                data: { hostPlayerId: nextHostId, status },
                include: lobbyInclude,
            });
        });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'player_left', { lobbyId, playerId });
        if (result.hostPlayerId !== lobby.hostPlayerId) {
            this.lobbyGateway.emitLobbyEvent(lobbyId, 'host_changed', {
                lobbyId,
                previousHostPlayerId: lobby.hostPlayerId,
                newHostPlayerId: result.hostPlayerId,
            });
        }
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'lobby_updated', result);
        return result;
    }
    async setReady(lobbyId, playerId, isReady) {
        const lobby = await this.findById(lobbyId);
        const member = lobby.members.find((m) => m.playerId === playerId);
        if (!member)
            throw new common_1.ForbiddenException('Only lobby members can update ready state');
        await this.prisma.lobbyMember.update({ where: { id: member.id }, data: { isReady } });
        const updatedLobby = await this.findById(lobbyId);
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'ready_changed', { lobbyId, playerId, isReady });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'lobby_updated', updatedLobby);
        return updatedLobby;
    }
    async startGame(lobbyId, playerId) {
        const lobby = await this.findById(lobbyId);
        if (lobby.hostPlayerId !== playerId) {
            throw new common_1.ForbiddenException('Only the host can start the game');
        }
        if (lobby.status !== client_1.LobbyStatus.OPEN && lobby.status !== client_1.LobbyStatus.FULL) {
            throw new common_1.BadRequestException('Lobby is not in a startable state');
        }
        if (lobby.members.length < 2) {
            throw new common_1.BadRequestException('At least 2 players are required');
        }
        if (lobby.members.some((member) => !member.isReady)) {
            throw new common_1.BadRequestException('All players must be ready');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const updatedLobby = await tx.lobby.update({
                where: { id: lobbyId },
                data: { status: client_1.LobbyStatus.IN_PROGRESS },
                include: lobbyInclude,
            });
            const gameSession = await tx.gameSession.create({
                data: {
                    lobbyId,
                    sessionCode: `GS-${Date.now().toString().slice(-6)}`,
                    status: 'ACTIVE',
                },
            });
            return { updatedLobby, gameSession };
        });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'game_started', {
            lobbyId,
            startedByPlayerId: playerId,
            gameSession: result.gameSession,
        });
        this.lobbyGateway.emitLobbyEvent(lobbyId, 'lobby_updated', result.updatedLobby);
        return result;
    }
};
exports.LobbyService = LobbyService;
exports.LobbyService = LobbyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        lobby_gateway_1.LobbyGateway])
], LobbyService);
//# sourceMappingURL=lobby.service.js.map