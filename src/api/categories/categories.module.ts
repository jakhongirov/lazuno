import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesEntity } from 'src/core/entity';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { JwtStrategy } from 'src/config/guards/jwt/jswt.strategy';
import { ProductsEntity } from 'src/core/entity';
import { ReviewsEntity } from 'src/core/entity';

import { RolesGuard } from 'src/config/guards/roles/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
    TypeOrmModule.forFeature([CategoriesEntity, ProductsEntity, ReviewsEntity]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtGuard, JwtStrategy, RolesGuard],
})
export class CategoriesModule {}
