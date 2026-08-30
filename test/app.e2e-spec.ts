import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) - Public welcome status', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('Selamat datang');
  });

  afterEach(async () => {
    await app.close();
  });
});
