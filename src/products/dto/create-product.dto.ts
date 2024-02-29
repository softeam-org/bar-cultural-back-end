import { ApiProperty } from '@nestjs/swagger';

import {IsArray} from 'class-validator';
import{
  IsNotEmpty,
  IsString,
  IsNumber,
  ArrayNotEmpty,
} from 'class-validator'

export class CreateProductDto {
  @ApiProperty({example: 'Martíni'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: 'Coquetel feito com gim e vermute seco, mexidos com gelo e coado em uma taça cocktail sem gelo'})
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({example: '20.5'})
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({ example: ['categoria1Id', 'categoria2Id'] })
  @IsArray()
  @ArrayNotEmpty()
  categoryIds: string[];
}