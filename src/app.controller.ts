import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';
import { Public } from './auth/public.decorator.js';

@ApiTags('Public')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Endpoint Sambutan & Status API (Public - Tanpa JWT)',
    description: 'Menampilkan informasi status server, link dokumentasi, dan ringkasan endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'Status API berhasil diambil',
  })
  getWelcome() {
    return this.appService.getWelcome();
  }

  @Public()
  @Get('public/info')
  @ApiOperation({
    summary: 'Statistik Ringkas Kampus (Public - Tanpa JWT)',
    description:
      'Endpoint publik tanpa otentikasi JWT yang menampilkan rekap total mahasiswa, jurusan, dan fakultas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data statistik publik berhasil diambil',
  })
  async getPublicInfo() {
    return this.appService.getPublicInfo();
  }

  @Public()
  @Get('public/mahasiswa')
  @ApiOperation({
    summary: 'Preview Data Mahasiswa (Public - Tanpa JWT)',
    description:
      'Endpoint publik tanpa otentikasi JWT untuk melihat cuplikan data mahasiswa (5 teratas).',
  })
  @ApiResponse({
    status: 200,
    description: 'Preview data mahasiswa berhasil diambil',
  })
  async getPublicMahasiswa() {
    return this.appService.getPublicMahasiswa();
  }
}
