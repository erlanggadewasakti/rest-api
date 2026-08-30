import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { MahasiswaService } from './mahasiswa.service.js';

describe('MahasiswaService', () => {
  let service: MahasiswaService;

  const mockMahasiswa = {
    id: 1,
    nim: '2024001',
    nama: 'Erlangga Dewa Sakti',
    jurusan: 'Teknik Informatika',
    fakultas: 'Ilmu Komputer',
    angkatan: 2024,
    email: 'erlangga@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    mahasiswa: {
      findMany: vi.fn().mockResolvedValue([mockMahasiswa]),
      findUnique: vi.fn(),
      count: vi.fn().mockResolvedValue(1),
      create: vi.fn().mockResolvedValue(mockMahasiswa),
      update: vi.fn().mockResolvedValue(mockMahasiswa),
      delete: vi.fn().mockResolvedValue(mockMahasiswa),
      groupBy: vi
        .fn()
        .mockResolvedValue([
          { jurusan: 'Teknik Informatika', _count: { id: 1 } },
        ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MahasiswaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MahasiswaService>(MahasiswaService);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of mahasiswa with pagination meta', async () => {
      mockPrismaService.mahasiswa.count.mockResolvedValue(1);
      mockPrismaService.mahasiswa.findMany.mockResolvedValue([mockMahasiswa]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return single mahasiswa if found', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValue(mockMahasiswa);

      const result = await service.findOne(1);
      expect(result.data.nim).toBe('2024001');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create new mahasiswa successfully', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValue(null);
      mockPrismaService.mahasiswa.create.mockResolvedValue(mockMahasiswa);

      const dto = {
        nim: '2024001',
        nama: 'Erlangga Dewa Sakti',
        jurusan: 'Teknik Informatika',
        fakultas: 'Ilmu Komputer',
        angkatan: 2024,
        email: 'erlangga@example.com',
      };

      const result = await service.create(dto);
      expect(result.data.nim).toBe('2024001');
    });

    it('should throw ConflictException if NIM already exists', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValueOnce(
        mockMahasiswa,
      );

      const dto = {
        nim: '2024001',
        nama: 'Erlangga Dewa Sakti',
        jurusan: 'Teknik Informatika',
        fakultas: 'Ilmu Komputer',
        angkatan: 2024,
        email: 'different@example.com',
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update (PUT)', () => {
    it('should update mahasiswa successfully', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValueOnce(
        mockMahasiswa,
      ); // existing check
      mockPrismaService.mahasiswa.update.mockResolvedValue({
        ...mockMahasiswa,
        nama: 'Erlangga Updated',
      });

      const updateDto = {
        nim: '2024001',
        nama: 'Erlangga Updated',
        jurusan: 'Teknik Informatika',
        fakultas: 'Ilmu Komputer',
        angkatan: 2024,
        email: 'erlangga@example.com',
      };

      const result = await service.update(1, updateDto);
      expect(result.data.nama).toBe('Erlangga Updated');
    });
  });

  describe('remove', () => {
    it('should delete mahasiswa if exists', async () => {
      mockPrismaService.mahasiswa.findUnique.mockResolvedValue(mockMahasiswa);
      mockPrismaService.mahasiswa.delete.mockResolvedValue(mockMahasiswa);

      const result = await service.remove(1);
      expect(result.message).toContain('Berhasil menghapus');
    });
  });
});
