// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Hardcoded credentials for simplicity
  private readonly adminUser = {
    id: 1,
    username: 'admin',
    password: 'password123',
  };

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    if (username !== this.adminUser.username || pass !== this.adminUser.password) {
      throw new UnauthorizedException();
    }
    
    const payload = { sub: this.adminUser.id, username: this.adminUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload, { expiresIn: '1h' }),
    };
  }
}