//definir os endpoints

import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete, 
    Patch
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
  } from '@nestjs/swagger';

import { EventService } from './event.service';
import { Event } from './entities/event.entity'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventController {
    constructor(private readonly eventsService: EventService) {}
    
    @ApiCreatedResponse({
        description: 'Evento criada com sucesso.',
        type: Event,
    })

    @ApiConflictResponse({ description: "Nome do evento"})
    @ApiBadGatewayResponse({ description: "Requisição invalida"})
    @Post()
    create(@Body() createEvetDto: CreateEventDto) {
        return this.eventsService.create(createEvetDto)
    }

    @ApiOkResponse({
        type: Event,
        isArray: true,
    })
    @Get()
    findAll(){
        return this.eventsService.findAll()    
    }

    @ApiOkResponse({
        type: Event,
        isArray: false,
    })
    @ApiBadRequestResponse({description: "Evento não existe"})
    @ApiConflictResponse({description: "Nome do evento ja existe"})
    @ApiOkResponse({
        type: Event,
        description: "Evento atualizado com sucesso",
    })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEventDto: UpdateEventDto,
    ) {
        return this.eventsService.update(id, updateEventDto)
    }

    @ApiBadRequestResponse({description: "Evento não existe"})
    @ApiOkResponse({description: "Evento removido com sucesso"})
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id)
    }
}

