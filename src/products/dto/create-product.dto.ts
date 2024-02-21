import { ApiProperty } from '@nestjs/swagger';

import{
  IsNotEmpty,
  IsString,
  IsNumber,
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
}