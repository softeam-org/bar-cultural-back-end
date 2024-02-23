import { Module } from '@nestjs/common';

import { AdministratorsModule } from './administrators/administrators.module';
import { CategoriesModule } from './categories/categories.module';
import { EventModule } from './events/event.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [AdministratorsModule, CategoriesModule, ProductsModule, EventModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
