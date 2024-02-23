import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as request from 'supertest';

import { AppModule } from '@src/app.module';
import { CreateEventDto } from '@src/events/dto/create-event.dto';
import { UpdateEventDto } from '@src/events/dto/update-event.dto';
import { Event } from '@src/events/entities/event.entity';
import { PrismaService } from '@src/prisma/prisma.service';

describe('Events (e2e)', () => {
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

  const createEventDto = new CreateEventDto();
  const event = new Event();

  beforeEach(async () => {
    createEventDto.created_by = 'criador';
    createEventDto.description = 'descriçao do evento';
    createEventDto.name = 'evento';

    event.id = expect.any(String);
    event.created_by = createEventDto.created_by;
    event.description = createEventDto.description;
    event.name = createEventDto.name;
    event.created_at = expect.any(String);
    event.updated_at = expect.any(String);

    await prisma.event.deleteMany();
  });

  test('/event (POST)', async () => {
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(409)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento já existe.');
      });
  });

  test('/event (GET)', async () => {
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
      });

    await request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect((response) => {
        expect(response.body[0]).toEqual(event);
      });
  });

  test('/event/:id (GET)', async () => {
    let eventId;
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        expect(response.body).toHaveProperty('id');
        eventId = response.body.id;
      });

    await request(app.getHttpServer())
      .get(`/events/${eventId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(event);
      });

    await request(app.getHttpServer())
      .get(`/events/invalido`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });

  test('/event/:id (PATCH)', async () => {
    let eventId;
    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        eventId = response.body.id;
      });

    createEventDto.name = 'Evento 2.0';

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201);

    const updatedEvent = new UpdateEventDto();
    updatedEvent.created_by = 'novo criador';
    updatedEvent.description = 'descriçao do evento';
    updatedEvent.name = 'nome alterado';

    await request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .send(updatedEvent)
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body.created_by).toEqual(updatedEvent.created_by);
        expect(body.description).toEqual(updatedEvent.description);
        expect(body.name).toEqual(updatedEvent.name);
      });

    updatedEvent.name = 'Evento 2.0';

    await request(app.getHttpServer())
      .patch(`/events/${eventId}`)
      .send(updatedEvent)
      .expect(409)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Evento já existe.');
      });

    await request(app.getHttpServer())
      .patch(`/events/invalido`)
      .send(updatedEvent)
      .expect(400)
      .expect((response) => {
        const { body } = response;
        expect(body.message).toEqual('Evento não existe.');
      });
  });

  test('/event (DELETE)', async () => {
    let eventId;

    await request(app.getHttpServer())
      .post('/events')
      .send(createEventDto)
      .expect(201)
      .expect((response) => {
        eventId = response.body.id;
      });

    await request(app.getHttpServer()).delete(`/events/${eventId}`).expect(200);

    await request(app.getHttpServer())
      .delete(`/events/${eventId}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toEqual('Evento não existe.');
      });
  });
});
