import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity('reviews')
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ default: 0 })
  stars: number;

  @ManyToOne(() => ProductsEntity, (product) => product.reviews)
  @JoinColumn()
  product: ProductsEntity;

  @CreateDateColumn()
  create_post_at: Date;
}
