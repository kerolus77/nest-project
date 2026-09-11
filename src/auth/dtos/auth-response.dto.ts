import { UserEntity, UserType } from '../../users/user.entity.js';

export class AuthResponseDto {
    id: string;
    userName: string;
    email: string;
    userType: UserType;
    isAccountVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    token: string;

    constructor(user: UserEntity, token: string) {
        this.id = user.id;
        this.userName = user.userName;
        this.email = user.email;
        this.userType = user.userType;
        this.isAccountVerified = user.isAccountVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.token = token;
    }
}