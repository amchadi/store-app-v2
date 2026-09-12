import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let app: AppController;
  let prisma: {
    $queryRaw: jest.Mock;
  };

  beforeAll(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    app = moduleRef.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return connected when database is reachable', async () => {
      prisma.$queryRaw.mockResolvedValue([{ 1: 1 }]);

      const result = await app.getHealth();

      expect(result).toEqual({
        status: true,
        service: 'store-app-api',
        database: 'connected',
      });
    });

    it('should return disconnected when database query fails', async () => {
      prisma.$queryRaw.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await app.getHealth();

      expect(result).toEqual({
        status: false,
        service: 'store-app-api',
        database: 'disconnected',
        message: 'Database connection failed',
      });
    });
  });
});