import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationProvider } from './notification.provider';
import { JwtAuthGuard } from '../lib/guards/jwt-auth.guard';
import { CurrentUser } from '../lib/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ResponseDto } from '../lib/dto/response.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly provider: NotificationProvider) {}

  @Get()
  @ApiOperation({ summary: 'Get unread and read notifications in user inbox' })
  @ApiResponse({ status: 200, type: ResponseDto, isArray: true })
  async getMyInbox(@CurrentUser() user: User) {
    return this.provider.getMyNotifications(user.id, user.tenantId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get quick count of unread alerts for dashboard badges' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async getCounts(@CurrentUser() user: User) {
    const count = await this.provider.getCounts(user.id, user.tenantId);
    return { success: true, message: 'Unread count fetched.', data: count };
  }

  @Post('read/:id')
  @ApiOperation({ summary: 'Mark an individual notification as read' })
  @ApiResponse({ status: 200, type: ResponseDto })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    await this.provider.read(id, user.id, user.tenantId);
    return { success: true, message: 'Notification marked as read.' };
  }
}
