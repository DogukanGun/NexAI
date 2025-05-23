import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserPrincipal } from '../interface/user-principal.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<UserPrincipal | null> {
    const user = await lastValueFrom(
      this.authService.validateUser(username, password),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
