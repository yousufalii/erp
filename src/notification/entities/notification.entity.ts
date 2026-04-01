import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTenantEntity } from '../../lib/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { NotificationType, NotificationPriority } from '../../lib/enums/notification.enum';

@Entity('notifications')
export class Notification extends BaseTenantEntity {
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationPriority, default: NotificationPriority.MEDIUM })
  priority: NotificationPriority;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  link: string; // Internal redirection link
}
