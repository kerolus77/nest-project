import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UsersService } from './users.service.js';
import { Roles } from '../auth/decorators/user_role.decorator.js';
import { UserType } from '../uitils/enums.js';
import { AuthRoleGuard } from '../auth/auth_role.guard.js';
import { CurrentUser } from '../auth/decorators/current_user.decorator.js';
import type { JwtPayload } from '../uitils/types.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { ApiBody, ApiConsumes, ApiSecurity } from '@nestjs/swagger';
import { ImageUploadDto } from './dtos/imageUpload.dto.js';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthRoleGuard)
    @ApiSecurity('bearer')
    find() {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    findOne(@Param('id',ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }



    @Patch(':id')
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    @UseInterceptors(FileInterceptor('userImage', {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 },
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: ImageUploadDto, description: 'Update user data', required: false})
    update(
        @Param('id',ParseUUIDPipe) id: string,
        @Body() updateData: UpdateUserDto,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
                new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
            ],
            fileIsRequired: false,
        })) image: Express.Multer.File | undefined,
        @CurrentUser() jwtPayload: JwtPayload,
    ) {
       return this.usersService.updateUser(id,updateData,image,jwtPayload);
    }

    @Delete(':id/image')
    @UseGuards(AuthGuard)
    @ApiSecurity('bearer')
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeImage(@Param('id',ParseUUIDPipe) id: string,@CurrentUser() jwtPayload: JwtPayload) {
        await this.usersService.removeUserImage(id, jwtPayload);
    }

    @Delete(':id')
    @ApiSecurity('bearer')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id',ParseUUIDPipe) id: string,@CurrentUser() jwtPayload: JwtPayload) {
        this.usersService.deleteUser(id, jwtPayload);
          }
}