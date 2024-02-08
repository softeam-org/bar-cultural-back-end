import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';

import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';

@Module({
  controllers: [AdministratorsController],
  providers: [AdministratorsService, PrismaService],
})
export class AdministratorsModule {}
