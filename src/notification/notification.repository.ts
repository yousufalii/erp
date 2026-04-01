import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const notify = this.repository.create(data);
    return this.repository.save(notify);
  }

  async findByUser(userId: string, tenantId: string): Promise<Notification[]> {
    return this.repository.find({
      where: { userId, tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string, userId: string, tenantId: string): Promise<void> {
    await this.repository.update({ id, userId, tenantId }, { isRead: true });
  }

  async getUnreadCount(userId: string, tenantId: string): Promise<number> {
    return this.repository.count({
      where: { userId, tenantId, isRead: false },
    });
  }
}
