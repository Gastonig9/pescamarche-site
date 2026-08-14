import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'staff')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: { user: { userId: string } }) {
    return this.notificationsService.findAll(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: { user: { userId: string } }) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Patch('read-all')
  markAllRead(@Req() req: { user: { userId: string } }) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @Req() req: { user: { userId: string } }) {
    return this.notificationsService.markRead(id, req.user.userId);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.notificationsService.deleteOne(id);
  }

  // Templates — admin only
  @Get('templates')
  @Roles('admin')
  findAllTemplates() {
    return this.notificationsService.findAllTemplates();
  }

  @Post('templates')
  @Roles('admin')
  createTemplate(@Body() dto: Record<string, unknown>) {
    return this.notificationsService.createTemplate(dto);
  }

  @Patch('templates/:id')
  @Roles('admin')
  updateTemplate(
    @Param('id') id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.notificationsService.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @Roles('admin')
  deleteTemplate(@Param('id') id: string) {
    return this.notificationsService.deleteTemplate(id);
  }
}
