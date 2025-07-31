import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { userEntity } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class dbService{
    constructor(
        @InjectRepository(userEntity)
        public readonly userRepo: Repository<userEntity>
    ){}
}