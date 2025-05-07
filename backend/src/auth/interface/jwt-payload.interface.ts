import { Role } from "generated/prisma/client";

export interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    roles: Role[];
    companyId?: string;
    verified: boolean;
}
