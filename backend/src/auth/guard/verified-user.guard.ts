import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from '../auth.service';

@Injectable()
export class VerifiedUserGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First use the JWT guard to validate the token and user
    const isAuthenticated = await super.canActivate(context);
    
    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }
    
    // Get the user from the request (set by JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    
    // Check if the user is verified
    const env = process.env.NODE_ENV;
    if (env === 'production' && !user.verified) {
      throw new ForbiddenException('This action requires a verified account');
    }
    
    return true;
  }
} 