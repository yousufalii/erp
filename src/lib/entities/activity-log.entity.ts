import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseTenantEntity } from './base.entity';

@Entity('activity_logs')
export class ActivityLog extends BaseTenantEntity {
  @Column()
  action: string;

  @Column({ nullable: true })
  module: string;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  errorMessage: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;
}
