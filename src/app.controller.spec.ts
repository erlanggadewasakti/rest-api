import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockPrismaService = {
      mahasiswa: {
        count: () => Promise.resolve(3),
        groupBy: () => Promise.resolve([]),
        findMany: () => Promise.resolve([]),
      },
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return welcome object', () => {
      const response = appController.getWelcome();
      expect(response.status).toBe('success');
      expect(response.message).toContain('Selamat datang di Mahasiswa RESTful API');
    });
  });
});
