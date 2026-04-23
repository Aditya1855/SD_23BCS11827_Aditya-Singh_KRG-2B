import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PlayerStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlayerDto) {
    try {
      return await this.prisma.player.create({
        data: {
          username: dto.username,
          email: dto.email,
          status: PlayerStatus.ONLINE,
        },
      });
    } catch {
      throw new ConflictException('Username or email already exists');
    }
  }

  findAll() {
    return this.prisma.player.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }
}
