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

  const createAdministratorDto = new CreateAdministratorDto();
  const administrator = new Administrator();

  beforeEach(async () => {
    createAdministratorDto.email = 'emailValido@gmail.com';
    createAdministratorDto.password = 'apodk#$23423GF';
    createAdministratorDto.name = 'mockson';

    administrator.id = expect.any(String);
    administrator.email = createAdministratorDto.email;
    administrator.name = createAdministratorDto.name;
    administrator.created_at = expect.any(String);
    administrator.updated_at = expect.any(String);

    await prisma.administrator.deleteMany();
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
    const administratorsNames = [
      'administrador2',
      'administrador1',
      'administrador3',
    ];
    const create = administratorsNames.map((name) => {
      const dto: CreateAdministratorDto = {
        email: name + '@gmail.com',
        name,
        password: createAdministratorDto.password,
      };
      return request(app.getHttpServer())
        .post('/administrators')
        .send(dto)
        .expect(201)
        .expect((response) => {
          expect(response.body).toHaveProperty('id');
        });
    });

    await Promise.all(create);

    await request(app.getHttpServer())
      .get('/administrators')
      .query({ order: 'asc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('administrador1');
        expect(response.body[1].name).toEqual('administrador2');
        expect(response.body[2].name).toEqual('administrador3');
      });

    await request(app.getHttpServer())
      .get('/administrators')
      .query({ order: 'desc' })
      .expect(200)
      .expect((response) => {
        expect(response.body[0].name).toEqual('administrador3');
        expect(response.body[1].name).toEqual('administrador2');
        expect(response.body[2].name).toEqual('administrador1');
      });

    await request(app.getHttpServer())
      .get('/administrators')
      .query({ order: 'as' })
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Ordem só pode ser 'asc' ou 'desc'",
        );
      });

    await request(app.getHttpServer())
      .get('/administrators')
      .query({ order: '' })
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toEqual(
          expect(response.body[0].name).toEqual('administrador2'),
        );
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
