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

import { AdministratorsService } from './administrators.service';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Administrator } from './entities/administrator.entity';

@ApiTags('Administrators')
@Controller('administrators')
export class AdministratorsController {
  constructor(private readonly administratorsService: AdministratorsService) {}

  @ApiCreatedResponse({
    description: 'Criado com sucesso.',
    type: Administrator,
  })
  @ApiConflictResponse({ description: 'Email já existe.' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida.' })
  @Post()
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorsService.create(createAdministratorDto);
  }

  @ApiOkResponse({
    type: Administrator,
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
  findAll(@Query('order', ParseSortOrderPipe) order: SortOrder) {
    return this.administratorsService.findAll(order);
  }

  @ApiOkResponse({
    description: 'Encontrado com sucesso.',
    type: Administrator,
  })
  @ApiBadRequestResponse({ description: 'Administrador não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.administratorsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Administrador não existe.' })
  @ApiConflictResponse({ description: 'Email já existe.' })
  @ApiOkResponse({
    description: 'Atualizado com sucesso.',
    type: Administrator,
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    return this.administratorsService.update(id, updateAdministratorDto);
  }

  @ApiBadRequestResponse({ description: 'Administrador não existe.' })
  @ApiOkResponse({ description: 'Removido com sucesso' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.administratorsService.remove(id);
  }
}
