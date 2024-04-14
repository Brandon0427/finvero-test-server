import { IsEmail, IsOptional, IsString } from "class-validator"

export class EditUserDto {
    //The ? states that it is an optional field
    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string
}