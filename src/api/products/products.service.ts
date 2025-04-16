import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from 'src/core/entity';
import { CategoriesEntity } from 'src/core/entity';
import { ReviewsEntity } from 'src/core/entity';
import { productsRepository } from 'src/core/repository';
import { categoriesRepository } from 'src/core/repository';
import * as fs from 'fs';
import * as path from 'path';
import { FilterProductDto } from './dto/fitter-product.dto';
import { In } from 'typeorm';
import { CreateProductDto } from './dto/create-product';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepo: productsRepository,

    @InjectRepository(CategoriesEntity)
    private categoriesRepo: categoriesRepository,
  ) {}

  async findProducts(
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: ProductsEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [products, total] = await this.productsRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      order: { id: 'DESC' },
    });

    return {
      data: products,
      total,
    };
  }

  async findProductsByCategories(
    category_id: number,
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: ProductsEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [products, total] = await this.productsRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      order: { id: 'DESC' },
      where: {
        category: {
          id: category_id,
        },
      },
      relations: ['category'],
    });

    return {
      data: products,
      total,
    };
  }

  async findProductsByColorCount(lang: string) {
    return this.productsRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('product.color', 'color')
      .addSelect('COUNT(product.id)', 'product_count')
      .where('category.lang = :lang', { lang })
      .groupBy('product.color')
      .getRawMany();
  }

  async filterProducts(
    filterData: FilterProductDto,
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: ProductsEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const where: any = {};

    if (filterData.color?.length) {
      where.color = In(filterData.color);
    }

    if (filterData.category_id?.length) {
      where.category_id = In(filterData.category_id);
    }

    const [products, total] = await this.productsRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      where,
      order: { id: 'DESC' },
    });

    return {
      data: products,
      total,
    };
  }

  async findProductByIdAmin(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const reviews = product.reviews || [];
    const totalRatings = reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageRating =
      reviews.length > 0 ? totalRatings / reviews.length : 0;

    const roundedRating = Math.round(averageRating * 10) / 10;

    const result = {
      ...product,
      averageRating: roundedRating,
      reviews_count: reviews.length,
    };

    return {
      data: result,
    };
  }

  async findProductById(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category', 'reviews'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.views += 1;
    await this.productsRepo.save(product);

    const reviews = product.reviews || [];
    const totalRatings = reviews.reduce((sum, review) => sum + review.stars, 0);
    const averageRating =
      reviews.length > 0 ? totalRatings / reviews.length : 0;

    const roundedRating = Math.round(averageRating * 10) / 10;

    const result = {
      ...product,
      averageRating: roundedRating,
      reviews_count: reviews.length,
    };

    return {
      data: result,
    };
  }

  async createProduct(
    productData: CreateProductDto,
    files: Express.Multer.File[],
  ): Promise<ProductsEntity> {
    const category = await this.categoriesRepo.findOne({
      where: { id: productData.category_id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const image_url = files.map(
      (file) => `https://srvr.lazuno.uz/uploads/${file.filename}`,
    );
    const image_name = files.map((file) => file.filename);

    const product = this.productsRepo.create({
      title: productData.title,
      description: productData.description,
      color: productData.color,
      image_url: image_url || [],
      image_name: image_name || [],
      category,
    });

    return await this.productsRepo.save(product);
  }

  async updateProduct(
    id: number,
    productData: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) throw new NotFoundException('Product not found');

    if (productData.title) product.title = productData.title;
    if (productData.description) product.description = productData.description;
    if (productData.color) product.color = productData.color;

    if (productData.category_id) {
      const category = await this.categoriesRepo.findOne({
        where: { id: productData.category_id },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (files && files.length > 0) {
      const imagePaths = product.image_name || [];
      imagePaths.forEach((filename) => {
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete image:', filePath);
        });
      });

      product.image_url = files.map(
        (file) => `https://srvr.lazuno.uz/uploads/${file.filename}`,
      );
      product.image_name = files.map((file) => file.filename);
    }

    return await this.productsRepo.save(product);
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const imagePaths = product.image_name || [];

    imagePaths.forEach((filename) => {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        filename,
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete image:', filePath);
      });
    });

    await this.productsRepo.remove(product);

    return { message: 'Product deleted successfully' };
  }
}
