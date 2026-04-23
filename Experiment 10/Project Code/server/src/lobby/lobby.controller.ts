import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { PlayerActionDto } from './dto/player-action.dto';
import { ReadyDto } from './dto/ready.dto';
import { LobbyService } from './lobby.service';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  create(@Body() dto: CreateLobbyDto) {
    return this.lobbyService.create(dto);
  }

  @Get()
  findAll() {
    return this.lobbyService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.lobbyService.findById(id);
  }

  @Get('code/:lobbyCode')
  findByCode(@Param('lobbyCode') code: string) {
    return this.lobbyService.findByCode(code);
  }

  @Get(':id/members')
  findMembers(@Param('id', ParseIntPipe) id: number) {
    return this.lobbyService.findMembers(id);
  }

  @Post(':id/join')
  join(@Param('id', ParseIntPipe) id: number, @Body() dto: PlayerActionDto) {
    return this.lobbyService.join(id, dto.playerId);
  }

  @Post(':id/leave')
  leave(@Param('id', ParseIntPipe) id: number, @Body() dto: PlayerActionDto) {
    return this.lobbyService.leave(id, dto.playerId);
  }

  @Post(':id/ready')
  setReady(@Param('id', ParseIntPipe) id: number, @Body() dto: ReadyDto) {
    return this.lobbyService.setReady(id, dto.playerId, dto.isReady);
  }

  @Post(':id/start')
  startGame(@Param('id', ParseIntPipe) id: number, @Body() dto: PlayerActionDto) {
    return this.lobbyService.startGame(id, dto.playerId);
  }
}
