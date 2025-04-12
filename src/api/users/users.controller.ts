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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/config/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/config/guards/roles/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/roles/roles.decorator';
import { Role } from 'src/common/database/Enums';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('list')
  @ApiOperation({ summary: 'Users list' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiQuery({
    name: 'take',
    required: true,
    type: Number,
    example: 10,
    description: 'Number of users per page',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  getusersList(
    @Query('take', ParseIntPipe) take: number = 10,
    @Query('page', ParseIntPipe) page: number = 1,
  ) {
    return this.usersService.findUsers(take, page);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'User by id' })
  @ApiResponse({ status: 200, description: 'Return find user.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'user id',
  })
  findUser(@Param('id') id: number) {
    return this.usersService.findUserById(id);
  }

  @HttpCode(201)
  @Post('create/superadmin')
  @ApiOperation({ summary: 'Create super admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
  })
  @ApiBody({ type: CreateUserDto })
  createSuperAdmin(@Body() userData: CreateUserDto) {
    return this.usersService.createSuperAdmin(userData);
  }

  @HttpCode(201)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('create/admin')
  @ApiOperation({ summary: 'Create admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
  })
  @ApiBody({ type: CreateUserDto })
  createAdmin(@Body() userData: CreateUserDto) {
    return this.usersService.createAdmin(userData);
  }

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials or missing fields',
  })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully updated.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'user id',
  })
  @ApiBody({ type: CreateUserDto })
  updateUser(@Param('id') id: number, @Body() userData: CreateUserDto) {
    return this.usersService.updateUser(id, userData);
  }

  @HttpCode(200)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    example: 10,
    description: 'user id',
  })
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
