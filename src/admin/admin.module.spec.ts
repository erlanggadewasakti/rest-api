import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AppAdminModule, getPrismaModel } from './admin.module.js';

describe('AppAdminModule & CRUD Configuration', () => {
  let module: TestingModule;
  let authService: AuthService;

  const mockHashedPassword = bcrypt.hashSync('rahasiadong123', 10);
  const mockAdminUser = {
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
    mahasiswa: {
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppAdminModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    authService = module.get<AuthService>(AuthService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  describe('getPrismaModel helper for Prisma 7 CRUD compatibility', () => {
    it('should map isId and isRequired onto Mahasiswa model fields', () => {
      const model = getPrismaModel('Mahasiswa');
      expect(model).toBeDefined();
      expect(model?.fields).toBeDefined();

      const idField = model?.fields.find((f: any) => f.name === 'id');
      expect(idField).toBeDefined();
      expect(idField?.isId).toBe(true);

      const nimField = model?.fields.find((f: any) => f.name === 'nim');
      expect(nimField).toBeDefined();
      expect(nimField?.isRequired).toBe(true);
    });

    it('should map isId and isRequired onto User model fields', () => {
      const model = getPrismaModel('User');
      expect(model).toBeDefined();

      const idField = model?.fields.find((f: any) => f.name === 'id');
      expect(idField?.isId).toBe(true);
    });
  });

  describe('AdminJS Authentication Validation', () => {
    it('should validate admin credentials matching Swagger credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockAdminUser);

      const validatedUser = await authService.validateUser(
        'admin',
        'rahasiadong123',
      );

      expect(validatedUser).toBeDefined();
      expect(validatedUser?.username).toBe('admin');
      expect(validatedUser?.role).toBe('admin');
    });

    it('should reject invalid passwords for AdminJS login', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockAdminUser);

      const validatedUser = await authService.validateUser(
        'admin',
        'wrong_password',
      );

      expect(validatedUser).toBeNull();
    });
  });
});
