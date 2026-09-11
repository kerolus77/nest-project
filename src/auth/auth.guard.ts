import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import type { JwtPayload } from '../uitils/types.js';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext){
        
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type === 'Bearer' && token) {
            try {
              const payload = await this.jwtService.verifyAsync<JwtPayload>(token,
                {
                  secret: this.configService.getOrThrow<string>('JWT_SECRET')
                }
              );
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