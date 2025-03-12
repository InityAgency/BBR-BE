import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserRepositoryImpl } from 'src/modules/user/infrastructure/user.repository';
import { UserResponse } from 'src/modules/user/ui/response/user-response';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userRepository: UserRepositoryImpl) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('serializeUser', user);
    done(null, { id: user.id, email: user.email }); // ✅ Store minimal session data
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.userRepository.findById(payload.id);
    done(null, new UserResponse(user!)); // ✅ Retrieve session data
  }
}
