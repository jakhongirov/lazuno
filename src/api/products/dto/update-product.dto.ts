import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated product title',
    example: 'Samsung Galaxy S24',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated product description',
    example: 'A high-end Android phone with advanced AI features.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated color of the product',
    example: 'Silver',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Updated category ID',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  category_id?: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Product images (array of files)',
  })
  files: any;
}
