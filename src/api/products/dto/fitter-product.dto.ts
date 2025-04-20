import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => parseInt(v, 10))
      : [parseInt(value, 10)],
  )
  category_id?: number[];
}
