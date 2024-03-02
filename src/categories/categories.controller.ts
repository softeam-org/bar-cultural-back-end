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

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso.',
    type: Category,
  })
  @ApiConflictResponse({ description: 'Nome da categoria já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOkResponse({
    type: Category,
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
    return this.categoriesService.findAll(order);
  }

  @ApiOkResponse({
    type: Category,
    isArray: false,
  })
  @ApiBadRequestResponse({ description: 'Categoria não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Categoria não existe.' })
  @ApiConflictResponse({ description: 'Nome da categoria já existe.' })
  @ApiOkResponse({
    description: 'Categoria atualizada com sucesso.',
    type: Category,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiBadRequestResponse({ description: 'Categoria não existe.' })
  @ApiOkResponse({ description: 'Categoria removida com sucesso.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
