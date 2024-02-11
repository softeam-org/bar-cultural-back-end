import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdministratorsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
