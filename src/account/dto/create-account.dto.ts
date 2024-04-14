import { IsNotEmpty, IsString } from "class-validator"

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    institution: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}