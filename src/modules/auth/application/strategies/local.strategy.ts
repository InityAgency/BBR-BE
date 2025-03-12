import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // ✅ Use email instead of username
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    console.log('Inside LocalStrategy.validate');
    console.log('user', email);
    console.log('password', password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
