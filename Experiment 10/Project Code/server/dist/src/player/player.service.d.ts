import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
export declare class PlayerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePlayerDto): Promise<{
        id: number;
        username: string;
        email: string | null;
        status: import("@prisma/client").$Enums.PlayerStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        username: string;
        email: string | null;
        status: import("@prisma/client").$Enums.PlayerStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        username: string;
        email: string | null;
        status: import("@prisma/client").$Enums.PlayerStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
