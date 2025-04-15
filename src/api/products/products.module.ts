import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesEntity } from 'src/core/entity';
import { ProductsEntity } from 'src/core/entity';
import { ReviewsEntity } from 'src/core/entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/config/guards/jwt/jswt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: "LAZUNO!@#$",
      }),
    }),
    TypeOrmModule.forFeature([CategoriesEntity, ProductsEntity, ReviewsEntity]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, JwtGuard, JwtStrategy, RolesGuard],
})
export class ProductsModule {}
