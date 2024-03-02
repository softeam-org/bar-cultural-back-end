import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ParseSortOrderPipe } from '@utils/pipes';
import { SortOrder } from '@utils/types';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedResponse({
    description: 'Criado com sucesso.',
    type: Product,
  })
  @ApiConflictResponse({ description: 'Produto já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiOkResponse({
    type: Product,
    isArray: true,
  })
  @ApiQuery({
    name: 'order',
    type: String,
    description:
      "Deve ser passado 'asc' ou vazio para retornar os dados ordenados em ordem crescente ou 'desc' para retornar em ordem descrescente com base no nome",
    required: false,
  })
  @Get()
  findAll(@Query('order', ParseSortOrderPipe) order?: SortOrder) {
    return this.productsService.findAll(order);
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso.',
    type: Product,
  })
  @ApiBadRequestResponse({ description: 'Produto não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Produto não existe.' })
  @ApiConflictResponse({ description: 'Produto já existe.' })
  @ApiOkResponse({
    description: 'Atualizado com sucesso.',
    type: Product,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiBadRequestResponse({ description: 'Produto não existe.' })
  @ApiOkResponse({ description: 'Removido com sucesso' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
