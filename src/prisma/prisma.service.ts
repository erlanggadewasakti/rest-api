import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

function createPrismaAdapter(connectionString: string) {
  if (
    connectionString.startsWith('postgresql://') ||
    connectionString.startsWith('postgres://')
  ) {
    return new PrismaPg(connectionString);
  }
  return new PrismaMariaDb(connectionString);
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://root:example_password@localhost:5432/rest_api?schema=public';
    const adapter = createPrismaAdapter(connectionString);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
