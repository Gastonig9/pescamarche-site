import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@pescamarche.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'changeme123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
