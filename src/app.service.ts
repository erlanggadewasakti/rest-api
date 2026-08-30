import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getWelcome() {
    return {
      status: 'success',
      message: 'Selamat datang di Mahasiswa RESTful API!',
      documentation: '/docs',
      serverTime: new Date().toISOString(),
      publicEndpoints: [
        'GET /',
        'GET /public/info',
        'GET /public/mahasiswa',
        'POST /auth/login',
        'GET /docs (Swagger UI)',
      ],
      protectedEndpoints: [
        'GET /auth/profile',
        'GET /mahasiswa',
        'GET /mahasiswa/:id',
        'POST /mahasiswa',
        'PUT /mahasiswa/:id',
        'DELETE /mahasiswa/:id',
      ],
    };
  }

  async getPublicInfo() {
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
      status: 'success',
      message: 'Informasi publik statistik kampus (Dapat diakses tanpa token JWT)',
      data: {
        totalMahasiswa,
        totalJurusan: totalJurusan.length,
        totalFakultas: totalFakultas.length,
        daftarJurusan: totalJurusan.map((j) => ({
          nama: j.jurusan,
          jumlahMahasiswa: j._count.id,
        })),
        daftarFakultas: totalFakultas.map((f) => ({
          nama: f.fakultas,
          jumlahMahasiswa: f._count.id,
        })),
      },
    };
  }

  async getPublicMahasiswa() {
    const list = await this.prisma.mahasiswa.findMany({
      take: 5,
      select: {
        id: true,
        nim: true,
        nama: true,
        jurusan: true,
        angkatan: true,
      },
      orderBy: { id: 'asc' },
    });

    return {
      status: 'success',
      message: 'Daftar 5 mahasiswa pertama untuk publik (Preview tanpa JWT)',
      data: list,
    };
  }
}
