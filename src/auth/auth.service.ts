import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { userEntity } from "libs/db/entities/user.entity";
import { SignUpDto } from "./dto/signUp.dto";

@Injectable()
export class AuthService{
  constructor (
    @InjectRepository(userEntity) private userRepo: Repository<userEntity>
  ){}

  async signUp(signUpDto: SignUpDto){
    // 1. hashed password
    const hashedPassword = await bcrypt.hash(signUpDto.password ,10);

    // 2. Create user
    const user = this.userRepo.create({
      ...SignUpDto,
      password: hashedPassword,
    })

    // 3. save in DB
    await this.userRepo.save(user)

    // 4. return message
    return{message: "User Registered Successfully"};
  }
}