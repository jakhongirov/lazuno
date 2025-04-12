import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'The latest iPhone model with titanium body.',
    description: 'Product description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Black', description: 'Product color' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 1, description: 'Category ID of the product' })
  @IsInt()
  category_id: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Product images (array of files)',
  })
  files: any;
}
