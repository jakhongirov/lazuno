import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { JwtStrategy } from 'src/config/guards/jwt/jswt.strategy';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import { UsersEntity } from 'src/core/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: "LAZUNO!@#$",
      }),
    }),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtGuard, JwtStrategy, RolesGuard],
})
export class UsersModule {}
