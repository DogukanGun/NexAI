import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser(username: string, password: string): Observable<any> {
    return from(this.userService.findByUsername(username)).pipe(
      map(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      })
    );
  }

  login(user: any): Observable<{ access_token: string }> {
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      companyId: user.companyId
    };
    return from(Promise.resolve({
      access_token: this.jwtService.sign(payload),
    }));
  }
}
