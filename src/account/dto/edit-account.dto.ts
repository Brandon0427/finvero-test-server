import { IsOptional, IsString } from "class-validator"

export class EditAccountDto {
    @IsString()
    @IsOptional()
    institution?: string

    @IsString()
    @IsOptional()
    link?: string
}