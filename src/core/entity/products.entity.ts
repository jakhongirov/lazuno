import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { ReviewsEntity } from './review.entity';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  color: string;

  @Column({ default: 0 })
  views: number;

  @Column('text', { array: true, default: [] })
  image_url: string[];

  @Column('text', { array: true, default: [] })
  image_name: string[];

  @ManyToOne(() => CategoriesEntity, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: CategoriesEntity;

  @OneToMany(() => ReviewsEntity, (review) => review.product)
  reviews: ReviewsEntity[];

  @CreateDateColumn()
  create_post_at: Date;
}
