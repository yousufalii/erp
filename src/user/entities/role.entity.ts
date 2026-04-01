import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { User } from './user.entity';
import { BaseTenantEntity } from '../../lib/entities/base.entity';

@Entity('roles')
@Unique(['name', 'tenantId'])
export class Role extends BaseTenantEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: [] })
  permissions: string[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
