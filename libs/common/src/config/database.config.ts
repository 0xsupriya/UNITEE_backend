import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const databaseConfig = registerAs(
    'database', () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: true,
    }) as TypeOrmModuleOptions,
)

