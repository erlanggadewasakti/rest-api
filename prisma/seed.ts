import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/rest_api?schema=public';
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding (PostgreSQL - Prisma 7)...');

  // 1. Seed Dummy Admin User
  const defaultPassword = 'rahasiadong123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
      nama: 'Administrator Kampus',
    },
    create: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator Kampus',
      role: 'admin',
    },
  });

  console.log(`✅ User seeded: username="${admin.username}", password="${defaultPassword}"`);

  // 2. Seed Sample Mahasiswa
  const mahasiswaData = [
    {
      nim: '2024001',
      nama: 'Erlangga Dewa Sakti',
      jurusan: 'Teknik Informatika',
      fakultas: 'Ilmu Komputer',
      angkatan: 2024,
      email: 'erlangga@example.com',
    },
    {
      nim: '2024002',
      nama: 'Budi Santoso',
      jurusan: 'Sistem Informasi',
      fakultas: 'Ilmu Komputer',
      angkatan: 2024,
      email: 'budi.santoso@example.com',
    },
    {
      nim: '2024003',
      nama: 'Siti Rahmawati',
      jurusan: 'Teknik Elektro',
      fakultas: 'Teknik',
      angkatan: 2024,
      email: 'siti.rahma@example.com',
    },
  ];

  for (const mhs of mahasiswaData) {
    const created = await prisma.mahasiswa.upsert({
      where: { nim: mhs.nim },
      update: mhs,
      create: mhs,
    });
    console.log(`✅ Mahasiswa seeded: [${created.nim}] ${created.nama}`);
  }

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
