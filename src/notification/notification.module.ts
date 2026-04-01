import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationRepository } from './notification.repository';
import { NotificationProvider } from './notification.provider';
import { NotificationController } from './notification.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [NotificationRepository, NotificationProvider],
  exports: [NotificationProvider],
})
export class NotificationModule {}
