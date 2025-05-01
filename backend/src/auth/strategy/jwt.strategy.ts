import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { UserPrincipal } from '../interface/authenticated-request.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  //payload is the decoded jwt clmais.
  validate(payload: JwtPayload): UserPrincipal {
    //console.log('jwt payload:' + JSON.stringify(payload));
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
      companyId: payload.companyId,
    };
  }
}
