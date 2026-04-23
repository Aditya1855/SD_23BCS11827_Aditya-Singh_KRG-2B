import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LobbyStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LobbyGateway } from '../websocket/lobby.gateway';
import { CreateLobbyDto } from './dto/create-lobby.dto';

const lobbyInclude = {
  members: {
    include: {
      player: true,
    },
    orderBy: { joinedAt: 'asc' as const },
  },
  hostPlayer: true,
} satisfies Prisma.LobbyInclude;

@Injectable()
export class LobbyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lobbyGateway: LobbyGateway,
  ) {}

  private createLobbyCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private async uniqueLobbyCode() {
    for (let i = 0; i < 10; i += 1) {
      const code = this.createLobbyCode();
      const exists = await this.prisma.lobby.findUnique({ where: { lobbyCode: code } });
      if (!exists) return code;
    }
    throw new BadRequestException('Could not generate unique lobby code');
  }

  async create(dto: CreateLobbyDto) {
    const host = await this.prisma.player.findUnique({ where: { id: dto.hostPlayerId } });
    if (!host) throw new NotFoundException('Host player not found');

    const lobbyCode = await this.uniqueLobbyCode();

    const lobby = await this.prisma.$transaction(async (tx) => {
      const created = await tx.lobby.create({
        data: {
          lobbyCode,
          hostPlayerId: dto.hostPlayerId,
          lobbyName: dto.lobbyName,
          gameMode: dto.gameMode,
          maxPlayers: dto.maxPlayers,
          status: LobbyStatus.OPEN,
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

  async findById(id: number) {
    const lobby = await this.prisma.lobby.findUnique({ where: { id }, include: lobbyInclude });
    if (!lobby) throw new NotFoundException('Lobby not found');
    return lobby;
  }

  async findByCode(code: string) {
    const lobby = await this.prisma.lobby.findUnique({ where: { lobbyCode: code }, include: lobbyInclude });
    if (!lobby) throw new NotFoundException('Lobby not found');
    return lobby;
  }

  async findMembers(id: number) {
    const lobby = await this.findById(id);
    return lobby.members;
  }

  async join(lobbyId: number, playerId: number) {
    const player = await this.prisma.player.findUnique({ where: { id: playerId } });
    if (!player) throw new NotFoundException('Player not found');

    const lobby = await this.findById(lobbyId);
    if (lobby.status !== LobbyStatus.OPEN) {
      throw new BadRequestException('Lobby is not open for joining');
    }
    if (lobby.members.length >= lobby.maxPlayers) {
      throw new BadRequestException('Lobby is full');
    }
    if (lobby.members.some((member) => member.playerId === playerId)) {
      throw new BadRequestException('Player is already in this lobby');
    }

    const updatedLobby = await this.prisma.$transaction(async (tx) => {
      await tx.lobbyMember.create({ data: { lobbyId, playerId } });
      const memberCount = await tx.lobbyMember.count({ where: { lobbyId } });
      const status = memberCount >= lobby.maxPlayers ? LobbyStatus.FULL : LobbyStatus.OPEN;

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

  async leave(lobbyId: number, playerId: number) {
    const lobby = await this.findById(lobbyId);
    const member = lobby.members.find((m) => m.playerId === playerId);
    if (!member) throw new BadRequestException('Player is not a lobby member');

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.lobbyMember.delete({ where: { id: member.id } });

      const remainingMembers = await tx.lobbyMember.findMany({
        where: { lobbyId },
        orderBy: { joinedAt: 'asc' },
      });

      if (remainingMembers.length === 0) {
        return tx.lobby.update({
          where: { id: lobbyId },
          data: { status: LobbyStatus.CLOSED },
          include: lobbyInclude,
        });
      }

      const nextHostId =
        lobby.hostPlayerId === playerId ? remainingMembers[0].playerId : lobby.hostPlayerId;

      const status =
        remainingMembers.length >= lobby.maxPlayers ? LobbyStatus.FULL : LobbyStatus.OPEN;

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

  async setReady(lobbyId: number, playerId: number, isReady: boolean) {
    const lobby = await this.findById(lobbyId);
    const member = lobby.members.find((m) => m.playerId === playerId);
    if (!member) throw new ForbiddenException('Only lobby members can update ready state');

    await this.prisma.lobbyMember.update({ where: { id: member.id }, data: { isReady } });
    const updatedLobby = await this.findById(lobbyId);

    this.lobbyGateway.emitLobbyEvent(lobbyId, 'ready_changed', { lobbyId, playerId, isReady });
    this.lobbyGateway.emitLobbyEvent(lobbyId, 'lobby_updated', updatedLobby);
    return updatedLobby;
  }

  async startGame(lobbyId: number, playerId: number) {
    const lobby = await this.findById(lobbyId);

    if (lobby.hostPlayerId !== playerId) {
      throw new ForbiddenException('Only the host can start the game');
    }

    if (lobby.status !== LobbyStatus.OPEN && lobby.status !== LobbyStatus.FULL) {
      throw new BadRequestException('Lobby is not in a startable state');
    }

    if (lobby.members.length < 2) {
      throw new BadRequestException('At least 2 players are required');
    }

    if (lobby.members.some((member) => !member.isReady)) {
      throw new BadRequestException('All players must be ready');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedLobby = await tx.lobby.update({
        where: { id: lobbyId },
        data: { status: LobbyStatus.IN_PROGRESS },
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
}
