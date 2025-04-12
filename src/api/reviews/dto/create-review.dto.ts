import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Name of the reviewer', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of the reviewer',
    example: 'john@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Review title', example: 'Amazing Product!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Review text',
    example: 'This product exceeded my expectations!',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ description: 'Rating in stars (1 to 5)', example: 5 })
  @IsNumber()
  @IsOptional()
  stars?: number;

  @ApiProperty({
    description: 'ID of the product being reviewed',
    example: 123,
  })
  @IsInt()
  product_id: number;
}
