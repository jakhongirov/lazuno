import { Repository } from 'typeorm';
import { ProductsEntity } from '../entity';

export type productsRepository = Repository<ProductsEntity>;
