import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { userEntity } from "libs/db/entities/user.entity";
export const databaseConfig = registerAs(
    'database', () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
            userEntity
        ],
        synchronize: true,
    }) as TypeOrmModuleOptions,
)

