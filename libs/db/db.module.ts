import { Module } from "@nestjs/common";
import { userEntity } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dbService } from "./db.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            userEntity
        ])
    ],
    providers: [dbService],
    exports: [TypeOrmModule, dbService]
})
export class dbModule{}