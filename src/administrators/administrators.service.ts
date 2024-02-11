import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

import { PrismaService } from '@src/prisma/prisma.service';

import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { selectAdmin } from './models';

@Injectable()
export class AdministratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      const { password } = createAdministratorDto;

      const roundsOfHashing = 10;
      const hashedPassword = await hash(String(password), roundsOfHashing);
      createAdministratorDto.password = hashedPassword;

      const administrator = await this.prisma.administrators.create({
        data: createAdministratorDto,
        select: selectAdmin,
      });
      return administrator;
    } catch (err) {
      throw new ConflictException('Email já existe.');
    }
  }

  async findAll() {
    return await this.prisma.administrators.findMany({ select: selectAdmin });
  }

  async findOne(id: string) {
    const administrator = await this.prisma.administrators.findFirst({
      where: { id },
      select: selectAdmin,
    });
    if (!administrator)
      throw new BadRequestException('Administrator não existe.');
    return administrator;
  }

  async update(id: string, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      delete updateAdministratorDto.password;
      const administrator = await this.prisma.administrators.update({
        where: { id },
        data: updateAdministratorDto,
        select: selectAdmin,
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
