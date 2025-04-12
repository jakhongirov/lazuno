import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics', description: 'Category title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'en', description: 'Language code for the category' })
  @IsString()
  @IsNotEmpty()
  lang: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Optional single image file',
  })
  image?: any;
}
