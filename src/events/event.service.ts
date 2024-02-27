import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { SortOrder } from '@utils/types';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    try {
      const event = await this.prisma.event.create({
        data: createEventDto,
      });
      return event;
    } catch (err) {
      throw new ConflictException('Evento já existe.');
    }
  }

  async findAll(order?: SortOrder): Promise<Event[]> {
    return await this.prisma.event.findMany({
      ...(order && { orderBy: { name: order } }),
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });
    if (!event) throw new BadRequestException('Evento não existe.');
    return event;
  }

  async update(id: string, updateEventeDto: UpdateEventDto): Promise<Event> {
    try {
      const event = await this.prisma.event.update({
        where: { id },
        data: updateEventeDto,
      });
      return event;
    } catch (err) {
      const recordNotFound = 'P2025';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      ) {
        throw new BadRequestException('Evento não existe.');
      } else throw new ConflictException('Evento já existe.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.event.delete({
        where: { id },
      });
    } catch (err) {
      throw new BadRequestException('Evento não existe.');
    }
  }
}
