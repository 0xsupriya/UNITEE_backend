import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Read token from "Authorization: Bearer <token>"
      secretOrKey: process.env.JWT_SECRET || 'supersceret',     // Secret used to sign the token
    });
  }

  // Automatically called by NestJS after token is validated
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    }; // This will be available as req.user in your controller
  }
}