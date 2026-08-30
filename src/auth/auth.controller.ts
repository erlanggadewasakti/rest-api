import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Public } from './public.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login pengguna untuk mendapatkan JWT Token',
    description:
      'Endpoint publik untuk otentikasi. Masukkan username dan password dummy yang telah disediakan.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login berhasil, mengembalikan JWT access token dan data user',
    schema: {
      example: {
        message: 'Login berhasil',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: '1d',
        user: {
          id: 1,
          username: 'admin',
          nama: 'Administrator Kampus',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Username atau password salah',
    schema: {
      example: {
        statusCode: 401,
        message: 'Username atau password salah',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Melihat profil user yang sedang login (Protected by JWT)',
    description:
      'Endpoint ini memerlukan Bearer Token JWT pada Header Authorization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Data profil user yang terautentikasi',
    schema: {
      example: {
        id: 1,
        username: 'admin',
        nama: 'Administrator Kampus',
        role: 'admin',
        createdAt: '2026-08-29T00:00:00.000Z',
        updatedAt: '2026-08-29T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized jika token tidak disediakan atau tidak valid',
  })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
