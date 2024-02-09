import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { CreateAdministratorDto } from '@src/administrators/dto/create-administrator.dto';
import { UpdateAdministratorDto } from '@src/administrators/dto/update-administrator.dto';
import { Administrator } from '@src/administrators/entities/administrator.entity';
import { AppModule } from '@src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const createAdministratorDto = new CreateAdministratorDto();

  beforeEach(async () => {
    createAdministratorDto.email = 'email-valid@gmail.com';
    createAdministratorDto.password = 'apodk#$23423GF';
    createAdministratorDto.name = 'mockson';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/administrator (POST)', () => {
    return request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });
  });

  it('should return error /administrator (POST)', () => {
    return request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('Email já existe.');
      });
  });

  it('/administrator (GET)', () => {
    const administrator = new Administrator();

    administrator.id = expect.any(String);
    administrator.created_at = expect.any(String);
    administrator.updated_at = expect.any(String);
    administrator.email = createAdministratorDto.email;
    administrator.name = createAdministratorDto.name;
    administrator.password = createAdministratorDto.password;

    return request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        expect(response.body[0]).toEqual(administrator);
      });
  });

  it('/administrator (GET)', async () => {
    let administratorId;
    await request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        administratorId = response.body[0].id;
      });

    return request(app.getHttpServer())
      .get(`/administrators/${administratorId}`)
      .expect(200);
  });

  it('shoudl return error /administrator (GET)', async () => {
    return request(app.getHttpServer())
      .get(`/administrators/${'invalido'}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Administrator não existe.');
      });
  });

  it('/administrator (PATCH)', async () => {
    let administratorId;
    await request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        administratorId = response.body[0].id;
      });

    const updatedAdministrator = new UpdateAdministratorDto();
    updatedAdministrator.email = 'email-alteradoo@gmail.com';
    updatedAdministrator.name = 'nome alterado';

    return request(app.getHttpServer())
      .patch(`/administrators/${administratorId}`)
      .send(updatedAdministrator)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.email).toEqual(updatedAdministrator.email);
        expect(body.name).toEqual(updatedAdministrator.name);
      });
  });

  it('should return errors /administrator (PATCH)', async () => {
    createAdministratorDto.email = 'email-valido2@gmail.com';
    await request(app.getHttpServer())
      .post('/administrators')
      .send(createAdministratorDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    let administratorId;
    await request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        administratorId = response.body[0].id;
      });

    const updatedAdministrator = new UpdateAdministratorDto();
    updatedAdministrator.email = 'email-valido2@gmail.com';
    updatedAdministrator.name = 'nome alterado';

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

  it('/administrator (DELETE)', async () => {
    let administratorId;
    request(app.getHttpServer())
      .get('/administrators')
      .expect(200)
      .expect((response) => {
        administratorId = response.body[0].id;
      });

    return request(app.getHttpServer())
      .delete(`/administrators/${administratorId}`)
      .expect(200);
  });

  it('should return error /administrator (DELETE)', async () => {
    request(app.getHttpServer())
      .delete(`/administrators/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Administrador não existe.');
      });
  });
});
