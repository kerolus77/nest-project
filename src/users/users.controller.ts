import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UsersService } from './users.service.js';
import { Roles } from '../auth/decorators/user_role.decorator.js';
import { UserType } from '../uitils/enums.js';
import { AuthRoleGuard } from '../auth/auth_role.guard.js';
import { CurrentUser } from '../auth/decorators/current_user.decorator.js';
import type { JwtPayload } from '../uitils/types.js';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRoleGuard)
    find() {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    findOne(@Param('id',ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }



    @Patch(':id')
    update(@Param('id',ParseUUIDPipe) id: string,@Body() updateData: UpdateUserDto) {
       return this.usersService.updateUser(id,updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id',ParseUUIDPipe) id: string,@CurrentUser() jwtPayload: JwtPayload) {
        this.usersService.deleteUser(id, jwtPayload);
          }
}