import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { SignUpGoogleCommandHandler } from '../commands/handlers/sign-up-google.command.handler';
import { FindByEmailQueryHandler } from '../commands/query/find-by-email.command.query';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly findbyEmailQueryHandler: FindByEmailQueryHandler,
    private readonly signUpGoogleCommandHandler: SignUpGoogleCommandHandler
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { email, given_name, family_name, email_verified, picture } = profile._json;
    let user = await this.findbyEmailQueryHandler.handler(email);

    if (!user) {
      user = await this.signUpGoogleCommandHandler.handler({
        email,
        fullName: `${given_name} ${family_name}`,
        signupMethod: profile.provider,
        emailVerified: email_verified,
      });
    } else {
      user = await this.findbyEmailQueryHandler.handler(email);
    }

    return done(null, user);
  }
}
