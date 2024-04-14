import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL')
                }
            }
        })
    }

    cleanDb(){
        //Transactions specify prisma to execute action on a specific order (bookmarks -> users)
        return this.$transaction([
            this.account.deleteMany(),
            this.user.deleteMany()
        ])
    }
}
