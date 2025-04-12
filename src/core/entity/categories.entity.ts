import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductsEntity } from './products.entity';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  lang: string;

  @Column()
  image_url: string;

  @Column()
  image_name: string;

  @OneToMany(() => ProductsEntity, (product) => product.category)
  products: ProductsEntity[];

  @CreateDateColumn()
  create_post_at: Date;
}
