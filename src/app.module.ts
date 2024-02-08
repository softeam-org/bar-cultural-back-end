import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdministratorsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
