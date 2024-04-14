import { Body, Controller, Get, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('me')
    getMe(
        @GetUser() user: User
    ) {
        return user;
    }

    @HttpCode(HttpStatus.OK)
    @Patch()
    editUser(
        @GetUser('id') userId: number, 
        @Body() dto: EditUserDto
    ) {
        return this.userService.editUser(userId, dto)
    }
}
