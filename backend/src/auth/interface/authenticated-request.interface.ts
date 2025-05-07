import { Request } from 'express';
import { Role } from 'generated/prisma/client';

export interface UserPrincipal {
    id: string;
    username: string;
    email: string;
    roles: Role[];
    companyId?: string;
}

export interface AuthenticatedRequest extends Request {
    user: UserPrincipal;
}
