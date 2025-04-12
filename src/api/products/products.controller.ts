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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FilterProductDto } from './dto/fitter-product.dto';
import { CreateProductDto } from './dto/create-product';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('list')
  @ApiOperation({ summary: 'Products list' })
  @ApiResponse({ status: 200, description: 'Return all Products.' })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of products per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  getProductsList(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return this.productsService.findProducts(take, page);
  }

  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Products list by category id' })
  @ApiResponse({
    status: 200,
    description: 'Return all Products by category id',
  })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of products per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'categoryId',
    required: true,
    type: Number,
    example: 1,
    description: 'Category id',
  })
  getProductsListByCategoryId(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('categoryId', ParseIntPipe) category_id: number = 1,
  ) {
    return this.productsService.findProductsByCategories(
      category_id,
      take,
      page,
    );
  }

  @HttpCode(200)
  @Get('color')
  @ApiOperation({ summary: 'Product color list for filter' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of Product color for filter',
  })
  @ApiQuery({
    name: 'lang',
    required: true,
    type: String,
    example: 'en',
    description: 'Language filter (e.g., en, uz, ru)',
  })
  getProductColor(@Query('lang') lang: string = 'en') {
    return this.productsService.findProductsByColorCount(lang);
  }

  @HttpCode(200)
  @Post('filter')
  @ApiOperation({ summary: 'Filter Product' })
  @ApiBody({ type: FilterProductDto })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of products per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  filterProducts(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
    @Body() filterData: FilterProductDto,
  ) {
    return this.productsService.filterProducts(filterData, take, page);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('admin/:id')
  @ApiOperation({ summary: 'Product by id for adminka' })
  @ApiResponse({
    status: 200,
    description: 'Return Product by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'product id',
  })
  getProductAdmin(@Param('id') id: number) {
    return this.productsService.findProductByIdAmin(id);
  }

  @HttpCode(200)
  @Get(':id')
  @ApiOperation({ summary: 'Product by id' })
  @ApiResponse({
    status: 200,
    description: 'Return Product by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'product id',
  })
  getProduct(@Param('id') id: number) {
    return this.productsService.findProductById(id);
  }

  @HttpCode(201)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Create a new product with images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.createProduct(body, files);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: path.join(__dirname, '..', '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Update a product with optional new files' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.updateProduct(id, body, files);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the product to delete',
  })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
