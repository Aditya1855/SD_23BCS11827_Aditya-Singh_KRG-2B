import { IsBoolean, IsInt } from 'class-validator';

export class ReadyDto {
  @IsInt()
  playerId!: number;

  @IsBoolean()
  isReady!: boolean;
}
