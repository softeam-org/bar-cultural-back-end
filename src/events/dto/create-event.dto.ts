import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'guilherme' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'descrição' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'rideclei' })
  @IsNotEmpty()
  @IsString()
  created_by: string;
}
