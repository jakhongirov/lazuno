import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity, ProductsEntity } from 'src/core/entity';
import { categoriesRepository, productsRepository } from 'src/core/repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Multer } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepo: categoriesRepository,

    //  @InjectRepository(ProductsEntity)
    //  private readonly productssRepo: productsRepository,
  ) {}

  async findCategories(
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: CategoriesEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [categories, total] = await this.categoriesRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      order: { id: 'DESC' },
    });

    return {
      data: categories,
      total,
    };
  }

  async findCategoriesByLang(
    take: number = 10,
    page: number = 1,
    lang: string,
  ): Promise<{ data: CategoriesEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [categories, total] = await this.categoriesRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      where: { lang },
      order: { id: 'DESC' },
    });

    return {
      data: categories,
      total,
    };
  }

  async findCategoriesProductCount(lang: string) {
    return this.categoriesRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .select('category.id', 'id')
      .addSelect('category.title', 'title')
      .addSelect('category.lang', 'lang')
      .addSelect('COUNT(product.id)', 'product_count')
      .where('category.lang = :lang', { lang })
      .groupBy('category.id')
      .addGroupBy('category.title')
      .addGroupBy('category.lang')
      .getRawMany();
  }

  async createCategory(
    categoryData: CreateCategoryDto,
    file: Multer.File,
  ): Promise<CategoriesEntity> {
    const newCategory = this.categoriesRepo.create({
      ...categoryData,
      image_url: `${process.env.UPLOAD_URL}/${file.filename}`,
      image_name: file.filename,
    });

    return await this.categoriesRepo.save(newCategory);
  }

  async updateCategory(
    id: number,
    categoryData: CreateCategoryDto,
    file?: Multer.File,
  ): Promise<CategoriesEntity> {
    const category = await this.categoriesRepo.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.title = categoryData.title;
    category.lang = categoryData.lang;

    if (file) {
      category.image_url = `${process.env.UPLOAD_URL}/${file.filename}`;
      category.image_name = file.filename;
    }

    return await this.categoriesRepo.save(category);
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    const existingCategory = await this.categoriesRepo.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (existingCategory.image_name) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        existingCategory.image_name,
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await this.categoriesRepo.remove(existingCategory);

    return { message: 'Category deleted successfully' };
  }
}
