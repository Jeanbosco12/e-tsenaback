import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // VALIDATE USER
  async validateUser(email: string, password: string): Promise<User> {
    const normalizedEmail = email.toLowerCase().trim();

    const user =
      await this.userService.findByEmailWithPassword(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  // LOGIN
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return {
        access_token: this.jwtService.sign(newPayload, {
          expiresIn: '15m',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
