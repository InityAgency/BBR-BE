import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserRepositoryImpl } from 'src/modules/user/infrastructure/user.repository';
import { UserResponse } from 'src/modules/user/ui/response/user-response';
import { validate as isUUID } from 'uuid';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userRepository: UserRepositoryImpl) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, { id: user.id, email: user.email });
  }

  async deserializeUser(payload: any, done: Function) {
    try {
      const user = await this.userRepository.findById(payload.id);

      if (!user) {
        return done(null, false);
      }

      done(null, new UserResponse(user));
    } catch (error) {
      done(error, false);
    }
  }
}
