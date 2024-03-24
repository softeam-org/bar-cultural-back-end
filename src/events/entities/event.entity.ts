import { ApiProperty } from '@nestjs/swagger';

export class Event {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}