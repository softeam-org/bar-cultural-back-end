import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { PrismaService } from './prisma/prisma.service';
import { EventModule } from './events/event.module';

@Module({
  imports: [AdministratorsModule, EventModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
