import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  private readonly logger = new Logger(ActivityLogService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly logRepo: Repository<ActivityLog>,
  ) {}

  /**
   * Save an activity log asynchronously to avoid slowing down responses.
   */
  async log(data: Partial<ActivityLog>) {
    try {
      const logEntry = this.logRepo.create(data);
      await this.logRepo.save(logEntry);
    } catch (error) {
      this.logger.error('Failed to save activity log:', error);
    }
  }
}
