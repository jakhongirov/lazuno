import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('list')
  @ApiOperation({ summary: 'Get paginated list of reviews' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of reviews per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews returned successfully',
  })
  getReviewsList(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return this.reviewsService.findReviews(take, page);
  }

  @HttpCode(200)
  @Get('product/:product_id')
  @ApiOperation({ summary: 'Get reviews for a specific product' })
  @ApiParam({
    name: 'product_id',
    type: Number,
    description: 'ID of the product',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of reviews per page',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of product reviews returned successfully',
  })
  getProductReviews(
    @Param('product_id', ParseIntPipe) product_id: number,
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return this.reviewsService.findReviewsByProduct(product_id, take, page);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single review by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the review to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully retrieved.',
  })
  getReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findReviewByid(id);
  }

  @HttpCode(201)
  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Review data to create a new review',
  })
  @ApiResponse({
    status: 201,
    description: 'Review successfully created',
  })
  createReview(@Body() reviewData: CreateReviewDto) {
    return this.reviewsService.createReview(reviewData);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the review' })
  @ApiResponse({ status: 200, description: 'Review successfully deleted' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.deleteReview(id);
  }
}
