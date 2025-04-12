import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductDto {
  @ApiPropertyOptional({
    type: [String],
    description: 'Filter by colors (e.g., ["red", "blue"])',
    example: ['red', 'blue'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  color?: string[];

  @ApiPropertyOptional({
    type: [Number],
    description: 'Filter by category IDs (e.g., [1, 2, 3])',
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  category_id?: number[];
}
