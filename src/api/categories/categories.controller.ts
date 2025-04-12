import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import { CategoriesService } from './categories.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Multer, diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly CategoriesService: CategoriesService) {}

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('list')
  @ApiOperation({ summary: 'Categories list' })
  @ApiResponse({ status: 200, description: 'Return all Categories.' })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of Categories per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  getCategoriesList(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return this.CategoriesService.findCategories(take, page);
  }

  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Categories list by lang' })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of categories by language.',
  })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of categories per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'lang',
    required: true,
    type: String,
    example: 'en',
    description: 'Language filter (e.g., en, uz, ru)',
  })
  getCategoriesListByLang(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('lang') lang: string = 'en',
  ) {
    return this.CategoriesService.findCategoriesByLang(take, page, lang);
  }

  @HttpCode(200)
  @Get('filter')
  @ApiOperation({ summary: 'Categories list for filter' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of categories for filter',
  })
  @ApiQuery({
    name: 'lang',
    required: true,
    type: String,
    example: 'en',
    description: 'Language filter (e.g., en, uz, ru)',
  })
  getCategoriesFilter(@Query('lang') lang: string = 'en') {
    return this.CategoriesService.findCategoriesProductCount(lang);
  }

  @HttpCode(201)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a new category with an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Category creation data with an image file',
    type: CreateCategoryDto,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: 'The name of the category',
        },
      },
    },
  })
  async createCategory(
    @UploadedFile() file: Multer.File,
    @Body() categoryData: CreateCategoryDto,
  ) {
    return this.CategoriesService.createCategory(categoryData, file);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../../../uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({
    summary: 'Update an existing category with an optional image',
  })
  @ApiConsumes('multipart/form-data') // Specifies that the API consumes multipart form data
  @ApiBody({
    description: 'Category update data with an optional image file',
    type: CreateCategoryDto,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'An image to update the category',
        },
        name: {
          type: 'string',
          description: 'The name of the category',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'category id',
  })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryData: CreateCategoryDto,
    @UploadedFile() file?: Multer.File,
  ) {
    return this.CategoriesService.updateCategory(id, categoryData, file);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'category id',
  })
  deleteCategory(@Param('id') id: number) {
    return this.CategoriesService.deleteCategory(id);
  }
}
