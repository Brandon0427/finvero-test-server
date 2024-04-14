import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    async signup(dto: AuthDto){
        // generate the password hash
        const hash = await argon.hash(dto.password);

        try{
            // save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                },
    
                //Items to return, the fields not stated are by default on false
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })

            //If everything is ok, return signInToken
            return this.signToken(user.id, user.email);
        } catch (e){
            if (e instanceof PrismaClientKnownRequestError){
                //Duplicate Unique Values Error
                if (e.code === 'P2002'){
                    throw new ForbiddenException('User Already Exists');
                }
            }
            else{
                throw e;
            }
        }
    }

    async signin(dto: AuthDto){
        //Find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })
        //If user does not exist throw exception
        if(!user){
            throw new ForbiddenException('User does not Exist!')
        }
        
        //Compare Password
        const pwMatch = await argon.verify(user.hash, dto.password);
        //If Password is incorrect, throw exception
        if(!pwMatch){
            throw new ForbiddenException('User or Password is incorrect')
        }

        //If everything is ok, return signInToken
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{accessToken: string}> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get("JWT_SECRET")

        const accessToken = await this.jwt.signAsync(
            payload, 
            {
                expiresIn: '60m',
                secret
            }
        );

        return {
            accessToken
        }
    }
}