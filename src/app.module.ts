import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { EventModule } from './events/event.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdministratorsModule, EventModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
