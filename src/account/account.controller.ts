import { Controller, UseGuards, Get, Post, Patch, Delete, Param, ParseIntPipe, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, EditAccountDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard) //Checks for the Bearer Token before executing the route
@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService){}

    @Get()
    getAccounts(
        @GetUser('id') userId: number
    ){
        return this.accountService.getAccounts(userId);
    }

    @Get(':id')
    getAccountById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) accountId: number
    ){
        return this.accountService.getAccountById(userId, accountId);
    }

    @Get(':id/transactions')
    getAllAccountTransactionsById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) accountId: number
    ){
        return this.accountService.getAccountTransactionsById(userId, accountId);
    }

    @Post()
    createAccount(
        @GetUser('id') userId: number,
        @Body() dto: CreateAccountDto
    ){
        return this.accountService.createAccount(userId, dto);
    }

    @Patch(':id')
    editAccountById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) accountId: number,
        @Body() dto: EditAccountDto
    ){
        return this.accountService.editAccountById(userId, accountId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteAccountById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) accountId: number,
    ){
        return this.accountService.deleteAccountById(userId, accountId);
    }
}
