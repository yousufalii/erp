import { Entity, Column, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from '../../lib/enums/user.enum';
import { BaseTenantEntity } from '../../lib/entities/base.entity';

@Entity('users')
export class User extends BaseTenantEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;
}
