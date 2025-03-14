import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserResponse } from 'src/modules/user/ui/response/user-response';
import { SignUpBuyerCommandHandler } from '../application/commands/handlers/sign-up-buyer.command.handler';
import { SignUpDeveloperCommandHandler } from '../application/commands/handlers/sign-up-developer.command.handler';
import { GoogleGuard } from '../application/guards/google.guard';
import { LocalAuthGuard } from '../application/guards/local-auth.guard';
import { CreateUserRequest } from './request/create-user.request';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpDeveloperHandler: SignUpDeveloperCommandHandler,
    private readonly signUpBuyerHandler: SignUpBuyerCommandHandler
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return new UserResponse(req.user);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req) {
    return 'OK';
  }

  @Post('signup/developer')
  async signUpDeveloper(@Body() command: CreateUserRequest): Promise<UserResponse> {
    const user = await this.signUpDeveloperHandler.handler(command);
    return new UserResponse(user);
  }

  @Post('signup/buyer')
  async signUpBuyer(@Body() command: CreateUserRequest): Promise<UserResponse> {
    const user = await this.signUpBuyerHandler.handler(command);
    return new UserResponse(user);
  }

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      req.session.destroy(() => {
        res.json({ message: 'Logged out' });
      });
    });
  }
}
