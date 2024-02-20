import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateCategoryDto } from '@src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@src/categories/dto/update-category.dto';
import { Category } from '@src/categories/entities/category.entity';
import { PrismaService } from '@src/prisma/prisma.service';

describe('Categories (e2e)', () => {
  let app: INestApplication;

  const createCategoryDto = new CreateCategoryDto();
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  const category = new Category();

  beforeEach(async () => {
    createCategoryDto.name = 'categoria';
    createCategoryDto.description = 'descrição da categoria';

    category.id = expect.any(String);
    category.name = createCategoryDto.name;
    category.description = createCategoryDto.description;
    category.created_at = expect.any(String);
    category.updated_at = expect.any(String);

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.category.deleteMany();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/category (POST)', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Nome da categoria já existe.');
      });
  });

  test('/category (GET)', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((response) => {
        expect(response.body[0]).toEqual(category);
      });
  });

  test('/category/:id (GET)', async () => {
    let categoryId;
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        categoryId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/categories/${categoryId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(category);
      });

    await request(app.getHttpServer())
      .get(`/categories/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Categoria não existe.');
      });
  });

  test('/category/:id (PATCH)', async () => {
    let categoryId;
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        categoryId = response.body.id;
      });

    createCategoryDto.name = 'categoria 2';
    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201);

    const updateCategoryDto = new UpdateCategoryDto();
    updateCategoryDto.name = 'nova categoria';
    updateCategoryDto.description = 'nova descrição';

    await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send(updateCategoryDto)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.name).toEqual(updateCategoryDto.name);
        expect(body.description).toEqual(updateCategoryDto.description);
      });

    updateCategoryDto.name = 'categoria 2';
    await request(app.getHttpServer())
      .patch(`/categories/${categoryId}`)
      .send(updateCategoryDto)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Nome da categoria já existe.');
      });

    await request(app.getHttpServer())
      .patch('/categories/invalido')
      .send(updateCategoryDto)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Categoria não existe.');
      });
  });

  test('/category/:id (DELETE)', async () => {
    let categoryId;

    await request(app.getHttpServer())
      .post('/categories')
      .send(createCategoryDto)
      .expect(201)
      .expect((response) => {
        const { body } = response;
        categoryId = body.id;
      });

    await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Categoria não existe.');
      });
  });
});
