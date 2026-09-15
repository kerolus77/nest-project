import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import type { JwtPayload } from '../uitils/types.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current_user.decorator.js';
import { RegisterDto } from './dtos/register.dto.js';
import { ForgotPasswordDto } from './dtos/forgetPassword.dto.js';
import { ResetPasswordDto } from './dtos/resetPassword.dto.js';

@Controller('api/users/auth')
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

    @Get('/verify-email/:id/:token')
    verifyEmail(@Param('id') id: string, @Param('token') token: string) {
        return this.authService.verifyEmail(token, id);
    }

    @Post('/forget-password')
    forgetPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgetPassword(dto);
    }

    @Get('/reset-password/:userId/:resetPasswordToken')
    getResetPasswordLink(@Param('userId') userId: string, @Param('resetPasswordToken') resetPasswordToken: string) {
        return this.authService.getResetPasswordLink(userId, resetPasswordToken);
    }

    @Post('/reset-password')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto);
    }

}
