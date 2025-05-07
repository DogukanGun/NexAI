import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Role } from 'generated/prisma/client';
import { UserPrincipal } from './interface/user-principal.interface';
import { RoleType } from '../config/enum';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: RoleType[];
  verified: boolean;
  companyId?: string | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  validateUser(username: string, password: string): Observable<UserPrincipal | null> {
    this.logger.log(`Validating user: ${username}`);
    
    return from(
      this.prismaService.user.findUnique({
        where: { username },
      })
    ).pipe(
      mergeMap(user => {
        if (!user) {
          this.logger.warn(`User not found: ${username}`);
          return of(null);
        }
        
        return from(bcrypt.compare(password, user.password)).pipe(
          map(isMatch => {
            if (isMatch) {
              this.logger.log(`User ${username} authenticated successfully`);
              
              // Map database roles to RoleType enum
              const roles = user.roles.map(role => {
                switch(role) {
                  case Role.ADMIN: return RoleType.ADMIN;
                  case Role.USER: default: return RoleType.USER;
                }
              });
              
              // Create UserPrincipal object without exposing the password
              const userPrincipal: UserPrincipal = {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: roles,
              };
              
              return userPrincipal;
            } else {
              this.logger.warn(`Invalid password for user: ${username}`);
              return null;
            }
          })
        );
      }),
      catchError(error => {
        this.logger.error(`Error validating user: ${error.message}`, error.stack);
        return of(null);
      })
    );
  }

  login(user: UserPrincipal): Observable<{ access_token: string }> {
    // Check if user is admin or get verification status
    // This will NOT block login, just include verification status in the token
    return (user.roles.includes(RoleType.ADMIN) ? 
      of(true) : 
      from(this.prismaService.user.findUnique({
        where: { id: user.id },
        select: { isVerified: true }
      })).pipe(
        map(result => result?.isVerified || false),
        catchError(() => of(false))
      )
    ).pipe(
      mergeMap(verified => {
        const payload: JwtPayload = { 
          sub: user.id, 
          username: user.username,
          email: user.email,
          roles: user.roles,
          verified: verified,
          companyId: null
        };
        
        this.logger.log(`User ${user.username} logged in with verification status: ${payload.verified}`);
        
        return from(this.jwtService.signAsync(payload)).pipe(
          map(access_token => ({ access_token }))
        );
      })
    );
  }
}
