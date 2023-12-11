import { user } from "src/user/user.entity"
import { type } from "../notification.entity"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateNotificationDto {
    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    type: type

    @IsNotEmpty()
    remmittent: user

    @IsNotEmpty()
    addressee: user
}