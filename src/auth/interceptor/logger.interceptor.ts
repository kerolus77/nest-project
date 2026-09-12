import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
       console.log('Request...');
       const now = Date.now();
       return next.handle().pipe(
         tap(() => console.log(`Response... ${Date.now() - now}ms`))
       );
    }
}