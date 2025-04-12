import { Repository } from 'typeorm';
import { CategoriesEntity } from '../entity';

export type categoriesRepository = Repository<CategoriesEntity>;
