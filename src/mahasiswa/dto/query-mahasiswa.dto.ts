import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryMahasiswaDto {
  @ApiPropertyOptional({
    description: 'Pencarian berdasarkan nama atau NIM',
    example: 'Erlangga',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan jurusan',
    example: 'Teknik Informatika',
  })
  @IsOptional()
  @IsString()
  jurusan?: string;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan tahun angkatan',
    example: 2024,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  angkatan?: number;

  @ApiPropertyOptional({
    description: 'Nomor halaman (pagination)',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Jumlah data per halaman',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
