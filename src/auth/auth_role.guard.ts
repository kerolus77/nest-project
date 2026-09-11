import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import type { JwtPayload } from '../uitils/types.js';
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthRoleGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {}
    async canActivate(context: ExecutionContext){
    const roles= this.reflector.getAllAndOverride('roles',[context.getHandler(),context.getClass()]);
        if(!roles||roles.length===0){
            throw new UnauthorizedException('Insufficient privileges');
        }
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type === 'Bearer' && token) {
            try {
              const payload = await this.jwtService.verifyAsync<JwtPayload>(token,
                {
                  secret: this.configService.getOrThrow<string>('JWT_SECRET')
                }
              );
              if(!roles.includes(payload.userType)){
                throw new UnauthorizedException('Insufficient privileges');
              }
              request.user = payload;
              return true;
            } catch {
                throw new UnauthorizedException('Invalid or expired token');
            }
        } else {
                throw new UnauthorizedException('Invalid or expired token');
        }


    }
}