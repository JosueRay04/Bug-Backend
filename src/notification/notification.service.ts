import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { notification } from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/createNotificationDto';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(notification) private notificationRepository: Repository<notification>) {

    }

    async createNotification(notification: CreateNotificationDto) {
        const newNotification = this.notificationRepository.create(notification);
        this.notificationRepository.save(newNotification);
    }

    getNotifications() {
        return this.notificationRepository.find();
    }

    async getNotification(id: number) {
        const notificationFound = await this.notificationRepository.findOne({where: { id }})

        if(!notificationFound) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }
    }

    async deleteNotification(id: number) {
        const result = await this.notificationRepository.delete({ id });

        if(result.affected === 0) {
            return new HttpException('Notification not found', HttpStatus.NOT_FOUND);
        }

        return result;
    }
}
