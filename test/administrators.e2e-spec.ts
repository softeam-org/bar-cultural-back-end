import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { CreateAdministratorDto } from '@src/administrators/dto/create-administrator.dto';
import { UpdateAdministratorDto } from '@src/administrators/dto/update-administrator.dto';
import { Administrator } from '@src/administrators/entities/administrator.entity';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/prisma/prisma.service';

describe('Administrators (e2e)', () => {
  let app: INestApplication;

  const createAdministratorDto = new CreateAdministratorDto();
  let moduleFixture: TestingModule;
  let prisma: PrismaService;

  const administrator = new Administrator();

  beforeEach(async () => {
    createAdministratorDto.email = 'email-valido@gmail.com';
    createAdministratorDto.password = 'apodk#$23423GF';
    createAdministratorDto.name = 'mockson';

    administrator.id = expect.any(String);
    administrator.email = createAdministratorDto.email;
    administrator.name = createAdministratorDto.name;
    administrator.created_at = expect.any(String);
    administrator.updated_at = expect.any(String);

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.administrators.deleteMany();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/administrator (POST)', async () => {
    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('Email já existe.');
      });
  });

  test('/administrator (GET)', async () => {
    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        expect(response.body[0]).toEqual(administrator);
      });
  });

  test('/administrator/:id (GET)', async () => {
    let administratorId;
    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        administratorId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/administrators/${administratorId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(administrator);
      });

    await request(app.getHttpServer())
      .get(`/administrators/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Administrator não existe.');
      });
  });

  test('/administrator/:id (PATCH)', async () => {
    let administratorId;
    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        administratorId = response.body.id;
      });

    createAdministratorDto.email = 'email-valido2@gmail.com';

    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201);

    const updatedAdministrator = new UpdateAdministratorDto();
    updatedAdministrator.email = 'email-alterado@gmail.com';
    updatedAdministrator.name = 'nome alterado';

    await request(app.getHttpServer())
      .patch(`/administrators/${administratorId}`)
      .send(updatedAdministrator)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.email).toEqual(updatedAdministrator.email);
        expect(body.name).toEqual(updatedAdministrator.name);
      });

    updatedAdministrator.email = 'email-valido2@gmail.com';

    await request(app.getHttpServer())
      .patch(`/administrators/${administratorId}`)
      .send(updatedAdministrator)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Email já existe.');
      });

    await request(app.getHttpServer())
      .patch(`/administrators/invalido`)
      .send(updatedAdministrator)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Administrador não existe.');
      });
  });

  test('/administrator (DELETE)', async () => {
    let administratorId;

    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        administratorId = response.body.id;
      });

    await request(app.getHttpServer())
      .delete(`/administrators/${administratorId}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/administrators/${administratorId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Administrador não existe.');
      });
  });
});
