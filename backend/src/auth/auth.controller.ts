import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedRequest } from './interface/authenticated-request.interface';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserPrincipal } from './interface/user-principal.interface';

// Define login DTO for Swagger documentation
class LoginDto {
  username: string;
  password: string;
}

@Controller({ path: '/auth' })
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      example: {
        value: {
          username: 'user',
          password: 'password',
        },
      },
    },
  })
  login(@Req() req: AuthenticatedRequest, @Res() res: FastifyReply): Observable<FastifyReply> {
    return this.authService.login(req.user as UserPrincipal)
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
