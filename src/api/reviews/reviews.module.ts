import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { JwtStrategy } from 'src/config/guards/jwt/jswt.strategy';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity, ReviewsEntity } from 'src/core/entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
    TypeOrmModule.forFeature([ProductsEntity, ReviewsEntity]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, JwtGuard, JwtStrategy],
})
export class ReviewsModule {}
