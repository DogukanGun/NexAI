import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './register.dto';
import { CompanyUserRegisterDto } from './dto/company-user-register.dto';
import { Observable, from, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { Role, UserType } from 'generated/prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    findByUsername(username: string): Observable<any> {
        return from(this.prisma.user.findUnique({
            where: { username }
        })).pipe(
            mergeMap(user => {
                if (!user) {
                    return throwError(() => new NotFoundException(`User ${username} not found`));
                }
                return from([user]);
            })
        );
    }

    existsByUsername(username: string): Observable<boolean> {
        return from(this.prisma.user.findUnique({
            where: { username }
        })).pipe(
            map(user => !!user)
        );
    }

    existsByEmail(email: string): Observable<boolean> {
        return from(this.prisma.user.findUnique({
            where: { email }
        })).pipe(
            map(user => !!user)
        );
    }

    register(registerDto: RegisterDto): Observable<any> {
        return from(bcrypt.hash(registerDto.password, 10)).pipe(
            mergeMap(hashedPassword => {
                return from(this.prisma.user.create({
                    data: {
                        username: registerDto.username,
                        email: registerDto.email,
                        password: hashedPassword,
                        firstName: registerDto.firstName,
                        lastName: registerDto.lastName,
                        userType: UserType.INDIVIDUAL,
                        roles: [Role.USER]
                    }
                }));
            })
        );
    }

    checkCompanyUserLimit(companyId: string): Observable<boolean> {
        return from(this.prisma.company.findUnique({
            where: { id: companyId },
            include: {
                _count: {
                    select: { users: true }
                }
            }
        })).pipe(
            map(company => {
                if (!company) {
                    return false;
                }
                return company._count.users < company.maxUsers;
            })
        );
    }

    registerCompanyUser(registerDto: CompanyUserRegisterDto, companyId: string): Observable<any> {
        return from(bcrypt.hash(registerDto.password, 10)).pipe(
            mergeMap(hashedPassword => {
                return from(this.prisma.user.create({
                    data: {
                        username: registerDto.username,
                        email: registerDto.email,
                        password: hashedPassword,
                        firstName: registerDto.firstName,
                        lastName: registerDto.lastName,
                        companyId: companyId,
                        userType: UserType.COMPANY_EMPLOYEE,
                        roles: [Role.USER]
                    }
                }));
            })
        );
    }

    findById(id: string, withFiles: boolean = false): Observable<any> {
        return from(this.prisma.user.findUnique({
            where: { id },
            include: withFiles ? { uploadedFiles: true } : undefined
        })).pipe(
            mergeMap(user => {
                if (!user) {
                    return throwError(() => new NotFoundException(`User ${id} not found`));
                }
                return from([user]);
            })
        );
    }
}
