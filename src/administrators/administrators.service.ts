import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
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
      throw new ConflictException('Email já existe');
    }
  }

  async findAll() {
    return await this.prisma.administrators.findMany();
  }

  async findOne(id: string) {
    try {
      const administrator = await this.prisma.administrators.findFirst({
        where: { id },
      });
      return administrator;
    } catch {
      throw new BadRequestException('Administrator não existe');
    }
  }

  async update(id: string, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.prisma.administrators.update({
        where: { id },
        data: updateAdministratorDto,
      });
      return administrator;
    } catch {
      throw new ConflictException('Email já existe.');
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
