import { Body, ConflictException, Controller, ForbiddenException, Post, Req, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { RegisterDto } from './register.dto';
import { CompanyUserRegisterDto } from './dto/company-user-register.dto';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interface/authenticated-request.interface';
import { Role } from 'generated/prisma/client';
import { AuthService } from '../auth/auth.service';

@Controller({ path: '/register' })
@ApiTags('register')
export class RegisterController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Register a new individual user' })
    register(@Body() registerDto: RegisterDto): Observable<{ access_token: string }> {
        const username = registerDto.username;

        return this.userService.existsByUsername(username).pipe(
            mergeMap(exists => {
                if (exists) {
                    throw new ConflictException(`username:${username} is existed`)
                }
                else {
                    const email = registerDto.email;
                    return this.userService.existsByEmail(email).pipe(
                        mergeMap(exists => {
                            if (exists) {
                                throw new ConflictException(`email:${email} is existed`)
                            }
                            else {
                                return this.userService.register(registerDto).pipe(
                                    mergeMap(user => this.authService.login(user))
                                );
                            }
                        })
                    );
                }
            })
        );
    }

    @Post('company')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Register a new company user (requires company admin)' })
    registerCompanyUser(
        @Body() registerDto: CompanyUserRegisterDto,
        @Req() req: AuthenticatedRequest): Observable<{ access_token: string }> {
        
        if (!req.user.roles.includes(Role.COMPANY_ADMIN)) {
            throw new ForbiddenException('Only company admins can register new users');
        }

        const companyId = req.user.companyId;
        if (!companyId) {
            throw new ForbiddenException('User is not associated with any company');
        }

        return this.userService.existsByUsername(registerDto.username).pipe(
            mergeMap(exists => {
                if (exists) {
                    throw new ConflictException(`username:${registerDto.username} is existed`)
                }
                return this.userService.existsByEmail(registerDto.email).pipe(
                    mergeMap(exists => {
                        if (exists) {
                            throw new ConflictException(`email:${registerDto.email} is existed`)
                        }
                        return this.userService.checkCompanyUserLimit(companyId).pipe(
                            mergeMap(canAddUser => {
                                if (!canAddUser) {
                                    throw new ForbiddenException('Company user limit reached');
                                }
                                return this.userService.registerCompanyUser(registerDto, companyId).pipe(
                                    mergeMap(user => this.authService.login(user))
                                );
                            })
                        );
                    })
                );
            })
        );
    }
}
