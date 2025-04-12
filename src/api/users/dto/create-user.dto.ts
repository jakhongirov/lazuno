import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Diyor123', description: 'user username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '12345', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
