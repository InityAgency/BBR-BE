import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { FindByEmailQueryHandler } from '../query/find-by-email.command.query';
import { SignUpGoogleCommandHandler } from '../handlers/sign-up-google.command.handler';
import { FindByEmailQuery } from '../commands/find-by-email.query';

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

    const query = new FindByEmailQuery(email);

    let user = await this.findbyEmailQueryHandler.handler(query);

    if (user) {
      if (user.signupMethod !== profile.provider) {
        throw new ForbiddenException(`Please use ${user.signupMethod} to login`);
      }
    }

    if (!user) {
      user = await this.signUpGoogleCommandHandler.handler({
        email,
        fullName: `${given_name} ${family_name}`,
        signupMethod: profile.provider,
        emailVerified: email_verified,
      });
    } else {
      user = await this.findbyEmailQueryHandler.handler(query);
    }

    return done(null, user);
  }
}
