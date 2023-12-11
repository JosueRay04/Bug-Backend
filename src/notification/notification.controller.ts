import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { notification } from './notification.entity';
import { CreateNotificationDto } from './dto/createNotificationDto';

@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get()
    getNotifications(): Promise<notification[]> {
        return this.notificationService.getNotifications();
    }

    @Get(':id')
    getNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.getNotification(id);
    }

    @Post('createNotifications')
    createNotification(@Body() newNotification: CreateNotificationDto) {
        this.notificationService.createNotification(newNotification);
    }

    @Delete(':id')
    deleteNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.deleteNotification(id);
    }

}
