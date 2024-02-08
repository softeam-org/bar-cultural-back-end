import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdministratorDto {
  @ApiProperty({ example: 'Mockson da Silva Santos' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'email-valido@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'pdoD34$#$@' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
