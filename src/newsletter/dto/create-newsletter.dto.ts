import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateNewsletterDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class SubscribeNewsletterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    verificationToken: string
}

export class UnSubscribeNewsletterDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string
}
