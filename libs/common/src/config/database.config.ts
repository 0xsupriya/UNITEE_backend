import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { userEntity } from "libs/db/entities/user.entity";

export const databaseConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,   // will be loaded by ConfigModule
    entities: [userEntity],
    synchronize: true,
  }),
);
