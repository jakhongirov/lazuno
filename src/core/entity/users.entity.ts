import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/common/database/Enums';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.ADMIN })
  role: Role;

  @CreateDateColumn()
  create_user_at: Date;
}
