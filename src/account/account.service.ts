import { ForbiddenException, Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateAccountDto, EditAccountDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService, private config: ConfigService){}

    ///////////////////////////////////////////////
    /////////// Http Request Functions ////////////
    ///////////////////////////////////////////////

    getAccounts(userId: number){
        return this.prisma.account.findMany({
            where: {
                userId
            }
        });   
    }

    getAccountById(userId: number, accountId: number){
        return this.prisma.account.findFirst({
            where: {
                id: accountId,
                userId
            }
        });
    }

    async getAccountTransactionsById(userId: number, accountId: number){
        //Get the Account
        const account = await this.prisma.account.findUnique({
            where: {
                id: accountId,
            }
        });

        //Validate if user owns the accounts
        if(!account){
            throw new ForbiddenException('Resource does not exist');
        } else if (account.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        } else{
            //Configure the request parameters for Belvo Request
            const request = {
                route: '/api/transactions/',
                params: {
                    link: account.link,
                    page_size: '10'
                }
            }

            //Execute the belvoRequest
            return this.getTransactions(request.route, request.params)
                .catch((error) => {
                    //If a request error exists return a Bad Request ERROR
                    console.log(error.response);
                    throw new ConflictException('Your request could not be processed at this time, try again later');
                });
        }
    };

    async createAccount(userId: number, dto: CreateAccountDto){
        const request = {
            route: '/api/links/',
            data: {
                institution: dto.institution,
                username: dto.username,
                password: dto.password
            }
        }

        await this.createAccountRequest(userId, request.route, request.data)
            .catch((error) => {
                console.log(error);
                throw new ConflictException('Your request could not be processed at this time, try again later');
            });
    }

    async editAccountById(userId: number, accountId: number, dto: EditAccountDto){
        //Get the Account
        const account = await this.prisma.account.findUnique({
            where: {
                id: accountId,
            }
        });

        //Validate if user owns the accounts
        if(!account){
            throw new ForbiddenException('Resource does not exist');
        } else if (account.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        } else{
            //Edit the account
            return this.prisma.account.update({
                where: {
                    id: accountId
                },
                data: {
                    ...dto
                }
            })
        }
    }

    async deleteAccountById(userId: number, accountId: number){
        console.log('Start: Delte Request')
        //Retrieve the account details
        const account = await this.prisma.account.findUnique({
            where: {
                id: accountId,
            }
        });

        //Validate if user owns the accounts
        if(!account){
            throw new ForbiddenException('Resource does not exist');
        } else if (account.userId !== userId) {
            throw new ForbiddenException('Access to resource denied');
        } else{
            const request = {
                route: '/api/links/' + account.link
            }

            await this.belvoDeleteRequest(accountId, request.route)
                .catch((error) => {
                    console.log(error);
                    throw new ConflictException('Your request could not be processed at this time, try again later');
                });
        }
    }

    ///////////////////////////////////////////////
    ////////////// Global Functions ///////////////
    ///////////////////////////////////////////////

    async getTransactions(route: string, params: object): Promise<{responseAPI: object}>{
        const mainBelvoSecretIDSandbox = this.config.get('SECRET_ID_BELVO_SANDBOX');
        const mainBelvoPasswordSandbox = this.config.get('SECRET_BELVO_PASSWORD_1_SANDBOX') + '#' + this.config.get('SECRET_BELVO_PASSWORD_2_SANDBOX');
        const accessTokenSandbox = Buffer.from(`${mainBelvoSecretIDSandbox}:${mainBelvoPasswordSandbox}`).toString('base64');
        const request = {
            baseURL: this.config.get('BASE_URL_BELVO_SANDBOX') + route,
            headersSandbox: {
                "Authorization": `Basic ${accessTokenSandbox}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Cache-Control": "No-cache"
            },
            params
        }

        //Make the transactions request to Belvo
        const responseAPI = await axios.get(
            request.baseURL,
            { headers: request.headersSandbox, params: request.params }
        ).then((axiosResponse) => {
            return { responseAPI: axiosResponse.data };
        })

        return responseAPI;
    }

    async createAccountRequest(userId: number, route: string, data: object){
        const mainBelvoSecretIDSandbox = this.config.get('SECRET_ID_BELVO_SANDBOX');
        const mainBelvoPasswordSandbox = this.config.get('SECRET_BELVO_PASSWORD_1_SANDBOX') + '#' + this.config.get('SECRET_BELVO_PASSWORD_2_SANDBOX');
        const accessTokenSandbox = Buffer.from(`${mainBelvoSecretIDSandbox}:${mainBelvoPasswordSandbox}`).toString('base64');
        const request = {
            baseURL: this.config.get('BASE_URL_BELVO_SANDBOX') + route,
            headersSandbox: {
                "Authorization": `Basic ${accessTokenSandbox}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Cache-Control": "No-cache"
            },
            data
        }

        //Make the transactions request to Belvo
        const responseAPI = await axios.post(
            request.baseURL,
            request.data,
            { headers: request.headersSandbox }
        )
        .then(async (axiosResponse) => {
            //If everything went correctly, save the data on Prisma
            await this.prisma.account.create({
                data: {
                    userId,
                    institution: axiosResponse.data.institution,
                    link: axiosResponse.data.id
                }
            })
        })

    }

    async belvoDeleteRequest(accountId: number, route: string){
        const mainBelvoSecretIDSandbox = this.config.get('SECRET_ID_BELVO_SANDBOX');
        const mainBelvoPasswordSandbox = this.config.get('SECRET_BELVO_PASSWORD_1_SANDBOX') + '#' + this.config.get('SECRET_BELVO_PASSWORD_2_SANDBOX');
        const accessTokenSandbox = Buffer.from(`${mainBelvoSecretIDSandbox}:${mainBelvoPasswordSandbox}`).toString('base64');
        const request = {
            baseURL: this.config.get('BASE_URL_BELVO_SANDBOX') + route,
            headersSandbox: {
                "Authorization": `Basic ${accessTokenSandbox}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Cache-Control": "No-cache"
            },
        }

        //Make the transactions request to Belvo
        await axios.delete(
            request.baseURL,
            { headers: request.headersSandbox }
        ).then(async () => {
            await this.prisma.account.delete({
                where: {
                    id: accountId
                }
            })
        })
    }
}
