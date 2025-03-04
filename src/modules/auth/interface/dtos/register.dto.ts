import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @MinLength(5)
    password: string;
}