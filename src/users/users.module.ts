import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
    controllers:[UsersController],
    providers:[UsersService],
    imports:[TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}