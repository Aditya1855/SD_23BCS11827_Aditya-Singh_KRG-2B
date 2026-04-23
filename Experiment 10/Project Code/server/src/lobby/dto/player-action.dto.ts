import { IsInt } from 'class-validator';

export class PlayerActionDto {
  @IsInt()
  playerId!: number;
}
