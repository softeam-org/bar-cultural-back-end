import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

import { PrismaService } from '@src/prisma/prisma.service';
import { SortOrder } from '@src/utils/types';

import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Administrator } from './entities/administrator.entity';
import { selectAdmin } from './models';

@Injectable()
export class AdministratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    try {
      const { password } = createAdministratorDto;

      const roundsOfHashing = 10;
      const hashedPassword = await hash(String(password), roundsOfHashing);
      createAdministratorDto.password = hashedPassword;

      const administrator = await this.prisma.administrator.create({
        data: createAdministratorDto,
        select: selectAdmin,
      });
      return administrator;
    } catch (err) {
      throw new ConflictException('Email já existe.');
    }
  }

  async findAll(order: SortOrder): Promise<Administrator[]> {
    return await this.prisma.administrator.findMany({
      select: selectAdmin,
      orderBy: { name: order },
    });
  }

  async findOne(id: string): Promise<Administrator> {
    const administrator = await this.prisma.administrator.findFirst({
      where: { id },
      select: selectAdmin,
    });
    if (!administrator)
      throw new BadRequestException('Administrator não existe.');
    return administrator;
  }

  async update(
    id: string,
    updateAdministratorDto: UpdateAdministratorDto,
  ): Promise<Administrator> {
    try {
      delete updateAdministratorDto.password;
      const administrator = await this.prisma.administrator.update({
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
      ) {
        throw new BadRequestException('Administrador não existe.');
      } else throw new ConflictException('Email já existe.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.administrator.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Administrador não existe.');
    }
  }
}
