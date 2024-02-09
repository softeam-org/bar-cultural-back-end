import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';

@Injectable()
export class AdministratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      const administrator = await this.prisma.administrators.create({
        data: createAdministratorDto,
      });
      return administrator;
    } catch (err) {
      throw new ConflictException('Email já existe.');
    }
  }

  async findAll() {
    return await this.prisma.administrators.findMany();
  }

  async findOne(id: string) {
    const administrator = await this.prisma.administrators.findFirst({
      where: { id },
    });
    if (!administrator)
      throw new BadRequestException('Administrator não existe.');
    return administrator;
  }

  async update(id: string, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.prisma.administrators.update({
        where: { id },
        data: updateAdministratorDto,
      });
      return administrator;
    } catch (err) {
      const recordNotFound = 'P2025';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        recordNotFound == err.code
      )
        throw new BadRequestException('Administrador não existe.');
      else throw new ConflictException('Email já existe.');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.administrators.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Administrador não existe.');
    }
  }
}
