//definir os endpoints

import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    Put, 
    Delete 
} from '@nestjs/common';

import { Event } from './entities/event.entity'
import { CreateEventDTO } from './dto/create-event.dto'
import { UpdateEventDTO } from './dto/update-event.dto';

