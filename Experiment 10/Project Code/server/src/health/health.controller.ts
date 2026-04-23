import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', service: 'lobby-service', timestamp: new Date().toISOString() };
  }

  @Get(':id')
  getHealthById(@Param('id', ParseIntPipe) id: number) {
    return { status: 'ok', checkId: id };
  }
}
