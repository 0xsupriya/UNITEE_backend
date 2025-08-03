import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUp.dto';
import { signInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: signUpDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: signInDto) {
    return this.authService.signin(dto);
  }
}