import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { Request as ExpressRequest } from 'express';
import { SignupDto } from './dto/signup.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token and user info',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: ExpressRequest) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    const result = await this.authService.login(req.user);
    this.logger.log(`User ${loginDto.username} logged in successfully`);
    return result;
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Username already exists' })
  @Public()
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    this.logger.log(`New signup request received for: ${signupDto.username}`);
    try {
      const result = await this.authService.signup(
        signupDto.username,
        signupDto.password,
      );
      this.logger.log(`Signup successful for: ${signupDto.username}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Signup failed for ${signupDto.username}: ${error.message}`,
      );
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    const user = req.user as { username: string; sub: string };
    this.logger.log(`Profile request for user: ${user.username}`);
    return req.user;
  }
}
