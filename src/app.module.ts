import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AdministratorsModule, CategoriesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
