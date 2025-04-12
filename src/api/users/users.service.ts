import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersEntity } from 'src/core/entity';
import { usersRepository } from 'src/core/repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/database/Enums';
import { InjectRepository } from '@nestjs/typeorm';
import { defer, firstValueFrom, Observable } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepo: usersRepository,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return defer(() => bcrypt.hash(password, 10));
  }

  async findUsers(
    take: number = 10,
    page: number = 1,
  ): Promise<{ data: UsersEntity[]; total: number }> {
    const skip = Number((page - 1) * take);
    const [users, total] = await this.usersRepo.findAndCount({
      ...(take > 0 ? { take } : {}),
      ...(skip > 0 ? { skip } : {}),
      order: { id: 'DESC' },
    });

    return {
      data: users,
      total,
    };
  }

  async findUserById(id: number) {
    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async createSuperAdmin(
    userData: CreateUserDto,
  ): Promise<{ user: UsersEntity; token: string }> {
    const passHash = await firstValueFrom(this.hashPassword(userData.password));

    const newUser = await this.usersRepo.create({
      username: userData.username,
      password: passHash,
      role: Role.SUPER_ADMIN,
    });

    const savedUser = await this.usersRepo.save(newUser);

    const payload = {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: savedUser,
      token: token,
    };
  }

  async createAdmin(
    userData: CreateUserDto,
  ): Promise<{ user: UsersEntity; token: string }> {
    const passHash = await firstValueFrom(this.hashPassword(userData.password));

    const newUser = this.usersRepo.create({
      username: userData.username,
      password: passHash,
      role: Role.ADMIN,
    });

    const savedUser = await this.usersRepo.save(newUser);

    const payload = {
      id: savedUser.id,
      username: savedUser.username,
      role: savedUser.role,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      user: savedUser,
      token: token,
    };
  }

  async validateUser(username: string, password: string): Promise<UsersEntity> {
    const user = await this.usersRepo.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as UsersEntity;
  }

  async login(
    userData: LoginUserDto,
  ): Promise<{ user: UsersEntity; token: string }> {
    const { username, password } = userData;

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const user = await this.validateUser(username, password);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = await this.jwtService.signAsync(user);

    return { user, token: token };
  }

  async updateUser(id: number, userData: CreateUserDto): Promise<UsersEntity> {
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }
    await this.usersRepo.update(id, userData);

    const updatedUser = await this.usersRepo.findOne({ where: { id } });
    if (!updatedUser) {
      throw new Error('User not found after update');
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    await this.usersRepo.remove(user);

    return { message: 'User deleted successfully' };
  }
}
