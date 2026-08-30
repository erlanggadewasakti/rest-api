import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto.js';
import { QueryMahasiswaDto } from './dto/query-mahasiswa.dto.js';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto.js';
import { MahasiswaService } from './mahasiswa.service.js';

@ApiTags('Mahasiswa')
@ApiBearerAuth()
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Get()
  @ApiOperation({
    summary: 'Mendapatkan semua data mahasiswa (Protected by JWT)',
    description:
      'Mengambil daftar data mahasiswa dengan dukungan pencarian (search), filter jurusan/angkatan, dan pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar data mahasiswa berhasil diambil',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Bearer token JWT tidak valid atau belum disertakan',
  })
  async findAll(@Query() query: QueryMahasiswaDto) {
    return this.mahasiswaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Mendapatkan detail mahasiswa berdasarkan ID (Protected by JWT)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID mahasiswa',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detail mahasiswa ditemukan',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahasiswa tidak ditemukan',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Bearer token JWT tidak valid',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mahasiswaService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Menambahkan data mahasiswa baru (Protected by JWT)',
    description:
      'Membuat entri mahasiswa baru di database. NIM dan Email harus unik.',
  })
  @ApiBody({ type: CreateMahasiswaDto })
  @ApiResponse({
    status: 201,
    description: 'Data mahasiswa berhasil dibuat',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validasi payload gagal',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - NIM atau Email sudah terdaftar sebelumnya',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Bearer token JWT tidak valid',
  })
  async create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return this.mahasiswaService.create(createMahasiswaDto);
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Memperbarui data mahasiswa secara penuh menggunakan PUT (Protected by JWT)',
    description:
      'Memperbarui seluruh atribut data mahasiswa berdasarkan ID. Sesuai spesifikasi RESTful PUT.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID mahasiswa yang akan diupdate',
    example: 1,
  })
  @ApiBody({ type: UpdateMahasiswaDto })
  @ApiResponse({
    status: 200,
    description: 'Data mahasiswa berhasil diperbarui',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validasi payload gagal',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahasiswa tidak ditemukan',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - NIM atau Email baru sudah digunakan oleh mahasiswa lain',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Bearer token JWT tidak valid',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMahasiswaDto: UpdateMahasiswaDto,
  ) {
    return this.mahasiswaService.update(id, updateMahasiswaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Menghapus data mahasiswa berdasarkan ID (Protected by JWT)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID mahasiswa yang akan dihapus',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Data mahasiswa berhasil dihapus',
  })
  @ApiResponse({
    status: 404,
    description: 'Mahasiswa tidak ditemukan',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Bearer token JWT tidak valid',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.mahasiswaService.remove(id);
  }
}
