import { Role } from "generated/prisma/client";

export interface JwtPayload {
    sub: string;
    username: string;
    roles: Role[];
    companyId?: string;
}
