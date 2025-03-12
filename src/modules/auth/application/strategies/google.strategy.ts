import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { email, given_name, family_name } = profile._json;

    // ✅ Check if user exists, if not, create one
    const user = await this.authService.findOrCreateGoogleUser({
      email,
      firstName: given_name,
      lastName: family_name,
      signupMethod: 'google',
    });

    return done(null, user); // ✅ Stores user session
  }
}
