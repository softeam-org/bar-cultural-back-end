import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bebidas' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;
}
