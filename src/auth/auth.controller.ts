import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import type { JwtPayload } from '../uitils/types.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current_user.decorator.js';
import { RegisterDto } from './dtos/register.dto.js';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
     register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: any) {
        return this.authService.login(loginDto);
    }

    @Get('/profile')
    @UseGuards(AuthGuard)
    getProfile(@CurrentUser() user:JwtPayload) {
        return this.authService.getProfile(user.id);
    }

}
