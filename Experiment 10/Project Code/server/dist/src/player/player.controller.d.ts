import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerService } from './player.service';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
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
