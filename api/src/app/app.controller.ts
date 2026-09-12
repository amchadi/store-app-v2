import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('health')
  async getHealth() {
  try {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: true,
      service: 'store-app-api',
      database: 'connected',
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown database error';

    return {
      status: false,
      service: 'store-app-api',
      database: 'disconnected',
      message,
    };
  }
}
}
