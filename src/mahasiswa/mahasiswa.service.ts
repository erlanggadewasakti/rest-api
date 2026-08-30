import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto.js';
import { QueryMahasiswaDto } from './dto/query-mahasiswa.dto.js';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto.js';

@Injectable()
export class MahasiswaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: QueryMahasiswaDto) {
    const page = query?.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query?.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query?.search) {
      where.OR = [
        { nama: { contains: query.search } },
        { nim: { contains: query.search } },
      ];
    }

    if (query?.jurusan) {
      where.jurusan = { contains: query.jurusan };
    }

    if (query?.angkatan) {
      where.angkatan = Number(query.angkatan);
    }

    const [total, data] = await Promise.all([
      this.prisma.mahasiswa.count({ where }),
      this.prisma.mahasiswa.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      message: 'Berhasil mengambil daftar mahasiswa',
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  }

  async findOne(id: number) {
    const mahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (!mahasiswa) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan`);
    }

    return {
      message: 'Berhasil mengambil detail mahasiswa',
      data: mahasiswa,
    };
  }

  async create(createMahasiswaDto: CreateMahasiswaDto) {
    // Cek duplikasi NIM
    const existingNim = await this.prisma.mahasiswa.findUnique({
      where: { nim: createMahasiswaDto.nim },
    });
    if (existingNim) {
      throw new ConflictException(
        `Mahasiswa dengan NIM '${createMahasiswaDto.nim}' sudah terdaftar`,
      );
    }

    // Cek duplikasi Email
    const existingEmail = await this.prisma.mahasiswa.findUnique({
      where: { email: createMahasiswaDto.email },
    });
    if (existingEmail) {
      throw new ConflictException(
        `Mahasiswa dengan Email '${createMahasiswaDto.email}' sudah terdaftar`,
      );
    }

    try {
      const data = await this.prisma.mahasiswa.create({
        data: {
          nim: createMahasiswaDto.nim,
          nama: createMahasiswaDto.nama,
          jurusan: createMahasiswaDto.jurusan,
          fakultas: createMahasiswaDto.fakultas,
          angkatan: Number(createMahasiswaDto.angkatan),
          email: createMahasiswaDto.email,
        },
      });

      return {
        message: 'Berhasil menambahkan data mahasiswa baru',
        data,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Gagal menambahkan data mahasiswa: ' + msg,
      );
    }
  }

  async update(id: number, updateMahasiswaDto: UpdateMahasiswaDto) {
    // 1. Cek apakah record ada
    const existing = await this.prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan`);
    }

    // 2. Cek apakah NIM bentrok dengan mahasiswa lain
    if (updateMahasiswaDto.nim !== existing.nim) {
      const nimConflict = await this.prisma.mahasiswa.findUnique({
        where: { nim: updateMahasiswaDto.nim },
      });
      if (nimConflict) {
        throw new ConflictException(
          `NIM '${updateMahasiswaDto.nim}' sudah digunakan oleh mahasiswa lain`,
        );
      }
    }

    // 3. Cek apakah Email bentrok dengan mahasiswa lain
    if (updateMahasiswaDto.email !== existing.email) {
      const emailConflict = await this.prisma.mahasiswa.findUnique({
        where: { email: updateMahasiswaDto.email },
      });
      if (emailConflict) {
        throw new ConflictException(
          `Email '${updateMahasiswaDto.email}' sudah digunakan oleh mahasiswa lain`,
        );
      }
    }

    // 4. Lakukan full update (HTTP PUT)
    try {
      const data = await this.prisma.mahasiswa.update({
        where: { id },
        data: {
          nim: updateMahasiswaDto.nim,
          nama: updateMahasiswaDto.nama,
          jurusan: updateMahasiswaDto.jurusan,
          fakultas: updateMahasiswaDto.fakultas,
          angkatan: Number(updateMahasiswaDto.angkatan),
          email: updateMahasiswaDto.email,
        },
      });

      return {
        message: `Berhasil memperbarui data mahasiswa ID ${id}`,
        data,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(
        'Gagal memperbarui data mahasiswa: ' + msg,
      );
    }
  }

  async remove(id: number) {
    const existing = await this.prisma.mahasiswa.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Mahasiswa dengan ID ${id} tidak ditemukan`);
    }

    await this.prisma.mahasiswa.delete({
      where: { id },
    });

    return {
      message: `Berhasil menghapus data mahasiswa ID ${id}`,
      data: existing,
    };
  }

  async getPublicSummary() {
    const [totalMahasiswa, totalJurusan, totalFakultas] = await Promise.all([
      this.prisma.mahasiswa.count(),
      this.prisma.mahasiswa.groupBy({
        by: ['jurusan'],
        _count: { id: true },
      }),
      this.prisma.mahasiswa.groupBy({
        by: ['fakultas'],
        _count: { id: true },
      }),
    ]);

    return {
      totalMahasiswa,
      totalJurusan: totalJurusan.length,
      totalFakultas: totalFakultas.length,
      distribusiJurusan: totalJurusan.map((j) => ({
        jurusan: j.jurusan,
        jumlah: j._count.id,
      })),
    };
  }
}
