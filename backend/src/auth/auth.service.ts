import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.log(`Attempting to validate user: ${username}`);
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.log(`User ${username} validated successfully`);
      const { password, ...result } = user;
      return result;
    }
    this.logger.warn(`Failed login attempt for user: ${username}`);
    return null;
  }

  async login(user: any) {
    this.logger.log(`Generating JWT token for user: ${user.username}`);
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async signup(username: string, password: string): Promise<any> {
    this.logger.log(`Signup attempt for username: ${username}`);

    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      this.logger.warn(`Signup failed: Username ${username} already exists`);
      throw new UnauthorizedException('Username already exists');
    }

    // Create new user
    this.logger.log(`Creating new user: ${username}`);
    const newUser = await this.usersService.create(username, password);

    // Return user data without password
    const { password: _, ...result } = newUser;
    this.logger.log(`User ${username} created successfully`);
    return result;
  }
}
