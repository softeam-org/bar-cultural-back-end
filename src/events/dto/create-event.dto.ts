import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'guilherme' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'descrição' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({example: new Date(2025,6,12)})
  @IsDate()
  ended_at: Date;

  @ApiProperty({ example: 'Ivete Sangalo' })
  @IsNotEmpty()
  @IsString()
  attraction: string;

  @ApiProperty({ example: ['Observação 1','Observação 2'] })
  @IsArray()
  @IsString({ each: true })
  observations: string[];

}
