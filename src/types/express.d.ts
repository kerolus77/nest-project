import type { jwtPayload } from '../uitils/tayps.js';

declare module 'express-serve-static-core' {
    interface Request {
        user?: jwtPayload;
    }
}

export {};