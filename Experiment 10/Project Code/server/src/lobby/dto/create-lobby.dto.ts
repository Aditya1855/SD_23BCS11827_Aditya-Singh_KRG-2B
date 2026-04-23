import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateLobbyDto {
  @IsInt()
  hostPlayerId!: number;

  @IsString()
  @Length(3, 40)
  lobbyName!: string;

  @IsString()
  @IsIn(['CLASSIC', 'RANKED', 'ARCADE', 'CUSTOM'])
  gameMode!: string;

  @IsInt()
  @Min(2)
  @Max(10)
  maxPlayers!: number;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
