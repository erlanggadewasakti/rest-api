import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMahasiswaDto {
  @ApiProperty({
    example: '2024004',
    description: 'Nomor Induk Mahasiswa (NIM) unik',
  })
  @IsString({ message: 'NIM harus berupa teks' })
  @IsNotEmpty({ message: 'NIM tidak boleh kosong' })
  nim: string;

  @ApiProperty({
    example: 'Ahmad Fauzi',
    description: 'Nama lengkap mahasiswa',
  })
  @IsString({ message: 'Nama harus berupa teks' })
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @ApiProperty({
    example: 'Teknik Informatika',
    description: 'Program studi / Jurusan mahasiswa',
  })
  @IsString({ message: 'Jurusan harus berupa teks' })
  @IsNotEmpty({ message: 'Jurusan tidak boleh kosong' })
  jurusan: string;

  @ApiProperty({
    example: 'Ilmu Komputer',
    description: 'Fakultas tempat mahasiswa terdaftar',
  })
  @IsString({ message: 'Fakultas harus berupa teks' })
  @IsNotEmpty({ message: 'Fakultas tidak boleh kosong' })
  fakultas: string;

  @ApiProperty({
    example: 2024,
    description: 'Tahun angkatan masuk kuliah',
  })
  @Type(() => Number)
  @IsInt({ message: 'Angkatan harus berupa bilangan bulat' })
  @Min(2000, { message: 'Tahun angkatan minimal 2000' })
  @Max(2100, { message: 'Tahun angkatan maksimal 2100' })
  angkatan: number;

  @ApiProperty({
    example: 'ahmad.fauzi@example.com',
    description: 'Alamat email aktif mahasiswa (unik)',
  })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;
}
