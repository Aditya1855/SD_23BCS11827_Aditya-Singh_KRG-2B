import { Module } from '@nestjs/common';
import { WebsocketModule } from '../websocket/websocket.module';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';

@Module({
  imports: [WebsocketModule],
  controllers: [LobbyController],
  providers: [LobbyService],
  exports: [LobbyService],
})
export class LobbyModule {}
