import { Global, Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';

@Global()
@Module({
  providers: [LobbyGateway],
  exports: [LobbyGateway],
})
export class WebsocketModule {}
