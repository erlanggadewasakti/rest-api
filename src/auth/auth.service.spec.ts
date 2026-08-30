import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  const mockHashedPassword = bcrypt.hashSync('rahasiadong123', 10);
  const mockUser = {
    id: 1,
    username: 'admin',
    password: mockHashedPassword,
    nama: 'Administrator Kampus',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
    },
  };

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('mock_jwt_token_xyz'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token on valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        username: 'admin',
        password: 'rahasiadong123',
      });

      expect(result.access_token).toBe('mock_jwt_token_xyz');
      expect(result.user.username).toBe('admin');
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({
          username: 'admin',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          username: 'nonexistent',
          password: 'rahasiadong123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
