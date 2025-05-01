import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: '/auth' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  login(@Req() req: AuthenticatedRequest, @Res() res: FastifyReply): Observable<FastifyReply> {
    return this.authService.login(req.user)
      .pipe(
        map(token => {
          res.header('Authorization', 'Bearer ' + token.access_token);
          return res.code(200).send({
            access_token: token.access_token
          });
        })
      );
  }
}
