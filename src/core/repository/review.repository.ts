import { Repository } from 'typeorm';
import { ReviewsEntity } from '../entity';

export type reviewsRepository = Repository<ReviewsEntity>;
