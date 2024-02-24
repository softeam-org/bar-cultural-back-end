//definir os endpoints

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ParseSortOrderPipe } from '@src/utils/pipes/ParseSortOrderPipe';
import { SortOrder } from '@src/utils/types/SortOrder';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @ApiCreatedResponse({
    description: 'Evento criado com sucesso.',
    type: Event,
  })
  @ApiConflictResponse({ description: 'Evento já existe' })
  @ApiBadGatewayResponse({ description: 'Requisição inválida' })
  @Post()
  create(@Body() createEvetDto: CreateEventDto) {
    return this.eventsService.create(createEvetDto);
  }

  @ApiOkResponse({
    type: Event,
    isArray: true,
  })
  @Get()
  findAll(@Query('order', ParseSortOrderPipe) order: SortOrder) {
    return this.eventsService.findAll(order);
  }

  @ApiOkResponse({
    type: Event,
  })
  @ApiBadRequestResponse({ description: 'Evento não existe.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiBadRequestResponse({ description: 'Evento não existe' })
  @ApiConflictResponse({ description: 'Nome do evento já existe' })
  @ApiOkResponse({
    type: Event,
    description: 'Evento atualizado com sucesso',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiBadRequestResponse({ description: 'Evento não existe' })
  @ApiOkResponse({ description: 'Evento removido com sucesso' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
