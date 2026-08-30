import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mahasiswa RESTful API')
    .setDescription(
      'Dokumentasi interaktif RESTful API Mahasiswa dengan Prisma ORM, JWT Authentication, dan Swagger UI.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description:
          'Masukkan access token JWT hasil dari endpoint /auth/login',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Public', 'Endpoint umum yang dapat diakses tanpa autentikasi JWT')
    .addTag('Auth', 'Endpoint otentikasi login & data profil pengguna')
    .addTag(
      'Mahasiswa',
      'Endpoint RESTful CRUD data mahasiswa (Protected by JWT)',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Mahasiswa API Docs - Swagger',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Aplikasi berjalan pada: http://localhost:${port}`);
  console.log(`📚 Dokumentasi Swagger:    http://localhost:${port}/docs`);
  console.log(`🎛️  AdminJS Dashboard:     http://localhost:${port}/admin`);
  console.log(
    `🗄️  Prisma Studio:         http://localhost:${process.env.STUDIO_PORT || 5555}`,
  );
}

await bootstrap();
