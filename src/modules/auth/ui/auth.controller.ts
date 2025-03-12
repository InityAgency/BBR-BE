import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../application/guards/local-auth.guard';
import { GoogleGuard } from '../application/guards/google.guard';
import { SessionAuthGuard } from '../application/guards/session-auth.guard';
import { UserResponse } from 'src/modules/user/ui/response/user-response';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    return new UserResponse(req.user);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(@Req() req, @Res() res) {
    return res.redirect('/dashboard');
  }

  @Get('profile')
  @UseGuards(SessionAuthGuard)
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logout(() => {
      req.session.destroy(() => {
        res.json({ message: 'Logged out' });
      });
    });
  }
}
