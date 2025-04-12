import { Repository } from 'typeorm';
import { UsersEntity } from '../entity';

export type usersRepository = Repository<UsersEntity>;
