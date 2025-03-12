import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../infrastructure/auth.repository';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // ✅ Validate User (For Local Strategy - Email/Password)
  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  // ✅ Sign In (Session-Based Login)
  async signIn(email: string, password: string) {
    const user = await this.validateUser(email, password); // ✅ Password is checked here

    return user; // ✅ Passport stores this user in session
  }

  // ✅ Sign Up (Register User)
  async signUp(userData: Partial<User>) {
    const existingUser = await this.authRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new UnauthorizedException('Email is already registered');
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    return this.authRepository.create({ ...userData, password: hashedPassword });
  }

  // ✅ Forgot Password (Trigger Password Reset)
  async forgotPassword(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // ✅ Generate reset token (in a real app, send via email)
    const resetToken = Math.random().toString(36).substr(2);

    // ✅ Save reset token to database (in a real app, store securely)
    await this.authRepository.saveResetToken(user.id, resetToken);

    return { message: 'Password reset link sent to email', token: resetToken };
  }

  // ✅ Google Login (Sign Up or Auto Login)
  async findOrCreateGoogleUser(userData: Partial<User>) {
    let user = await this.authRepository.findByEmail(userData.email!);

    if (!user) {
      user = await this.authRepository.create({
        ...userData,
        signupMethod: 'google',
      });
    }

    return user;
  }
}
