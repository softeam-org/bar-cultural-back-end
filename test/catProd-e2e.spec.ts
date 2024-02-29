import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateCategoryDto } from '@src/categories/dto/create-category.dto';
import { Category } from '@src/categories/entities/category.entity';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateProductDto } from '@src/products/dto/create-product.dto';
import { Product } from '@src/products/entities/product.entity';

describe('Category-Product Relationship (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  let createdCategory: Category;
  let createdProduct: Product;

  beforeEach(async () => {
    // Limpa o banco de dados antes de cada teste
    await prisma.category.deleteMany();
    await prisma.product.deleteMany();

    // Cria uma categoria
    const createCategoryDto = new CreateCategoryDto();
    createCategoryDto.name = 'categoria';
    createCategoryDto.description = 'descrição da categoria';
    createdCategory = await prisma.category.create({ data: createCategoryDto });

    // Cria um produto
    const createProductDto = new CreateProductDto();
    createProductDto.name = 'produto';
    createProductDto.description = 'descrição do produto';
    createProductDto.value = 10.0;
    createdProduct = await prisma.product.create({ data: createProductDto });

    // Associa o produto à categoria
    await prisma.categoryProduct.create({
      data: {
        category_id: createdCategory.id,
        product_id: createdProduct.id,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  test('Associate Product with Category', async () => {
    const newProductDto: CreateProductDto = {
      name: 'novo produto',
      description: 'descrição do novo produto',
      value: 20.0,
      categoryIds: [createdCategory.name]
    };

    // Cria um novo produto
    const response = await request(app.getHttpServer())
      .post(`/products`)
      .send(newProductDto)
      .expect(201);

    const newProduct: Product = response.body;

    // Associa o novo produto à categoria existente
    await request(app.getHttpServer())
      .post(`/categories/${createdCategory.id}/products/${newProduct.id}`)
      .expect(201);

    // Verifica se o novo produto está associado à categoria
    const productsInCategory = await prisma.categoryProduct.findMany({
      where: { category_id: createdCategory.id },
    });
    expect(productsInCategory.length).toBe(2);
  });

  test('Get Products Associated with Category', async () => {
    // Solicita os produtos associados à categoria
    const response = await request(app.getHttpServer())
      .get(`/categories/${createdCategory.id}/products`)
      .expect(200);

    const productsInCategory: Product[] = response.body;
    expect(productsInCategory.length).toBe(1);
    expect(productsInCategory[0].id).toBe(createdProduct.id);
    expect(productsInCategory[0].name).toBe(createdProduct.name);

  });
});
