import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity, ReviewsEntity } from 'src/core/entity';
import { productsRepository, reviewsRepository } from 'src/core/repository';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly reviewsRepo: reviewsRepository,

    @InjectRepository(ProductsEntity)
    private productsRepo: productsRepository,
  ) {}

  async findReviews(
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: ReviewsEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [reviews, total] = await this.reviewsRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      order: { id: 'DESC' },
    });

    return {
      data: reviews,
      total,
    };
  }

  async findReviewsByProduct(
    product_id: number,
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: ReviewsEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [reviews, total] = await this.reviewsRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      where: {
        product: {
          id: product_id,
        },
      },
      order: { id: 'DESC' },
    });

    return {
      data: reviews,
      total,
    };
  }

  async findReviewByid(id: number): Promise<{ data: ReviewsEntity | null }> {
    const review = await this.reviewsRepo.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return {
      data: review,
    };
  }

  async createReview(reviewData: CreateReviewDto): Promise<ReviewsEntity> {
    const product = await this.productsRepo.findOne({
      where: { id: reviewData.product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = this.reviewsRepo.create({
      name: reviewData.name,
      email: reviewData.email,
      title: reviewData.title,
      text: reviewData.text,
      stars: reviewData.stars,
      product,
    });

    return await this.reviewsRepo.save(review);
  }

  async deleteReview(id: number): Promise<{ message: string }> {
    const review = await this.reviewsRepo.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepo.remove(review);

    return { message: 'Review deleted successfully' };
  }
}
