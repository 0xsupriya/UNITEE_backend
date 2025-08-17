import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { userEntity } from "libs/db/entities/user.entity";
import { SignUpDto } from "./dto/signUp.dto";
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dto/signIn.dto";
import { th } from "zod/v4/locales/index.cjs";

@Injectable()
export class AuthService{
  constructor (
    @InjectRepository(userEntity) private userRepo: Repository<userEntity>,
    private jwt: JwtService
  ){}

  // Sign Up
  async signUp(signUpDto: SignUpDto){
    // 1. check if email is already exist
    const exist = await this.userRepo.findOne({where: {email: signUpDto.email}});
    if(exist) throw new BadRequestException('Email already in use');

    // 2. hashed password
    const hashedPassword = await bcrypt.hash(signUpDto.password ,10);

    // 3. Create user
    const user = this.userRepo.create({
      ...signUpDto,
      password: hashedPassword,
    })

    // 4. save in DB
    await this.userRepo.save(user);

    // 5. return message
    return{message: "User Registered Successfully"};
  }


  // Sign In
  async signIn(signInDto: SignInDto){
    // 1. Find by email
    const user = await this.userRepo.findOne({where: {email: signInDto.email}});
    if(!user) throw new BadRequestException("Email is already in use");

    // 2. Compared password
    const isMatch = await bcrypt.compare(signInDto.password, user.password);
    if(isMatch) throw new BadRequestException("Invalid Credentials");

    // 3. Create JWT token
    const token = this.jwt.sign({id: user.id, email: user.email});

    // 4. return token
    return {message: "SignIn Successful" , token};
  }
}