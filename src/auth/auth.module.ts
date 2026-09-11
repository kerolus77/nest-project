import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule,TypeOrmModule.forFeature([UserEntity]),
 JwtModule.registerAsync({
  global: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions:{expiresIn: configService.get<string>('JWT_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`},
  })
  
 }),
],
})
export class AuthModule {}
