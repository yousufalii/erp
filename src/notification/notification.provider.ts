import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NotificationType, NotificationPriority } from '../lib/enums/notification.enum';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationProvider {
  private readonly logger = new Logger(NotificationProvider.name);

  constructor(private readonly repository: NotificationRepository) {}

  async notify(
    userId: string, 
    tenantId: string, 
    title: string, 
    message: string, 
    type: NotificationType = NotificationType.SYSTEM,
    priority: NotificationPriority = NotificationPriority.MEDIUM
  ): Promise<Notification> {
    
    // 1. Save In-App Notification (Always)
    const record = await this.repository.create({
      userId,
      tenantId,
      title,
      message,
      type,
      priority,
    });

    // 2. Trigger Email (Simulated for PRD 6.0)
    // To implement real Email: inject an EmailService/Mailer here
    this.logger.log(`[EMAIL SIMULATION] To: UserID ${userId} | Subject: ${title} | Body: ${message}`);

    return record;
  }

  async getMyNotifications(userId: string, tenantId: string): Promise<Notification[]> {
    return this.repository.findByUser(userId, tenantId);
  }

  async read(id: string, userId: string, tenantId: string): Promise<void> {
    await this.repository.markAsRead(id, userId, tenantId);
  }

  async getCounts(userId: string, tenantId: string): Promise<number> {
    return this.repository.getUnreadCount(userId, tenantId);
  }
}
