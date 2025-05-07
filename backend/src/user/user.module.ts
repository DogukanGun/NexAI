import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RegisterController } from './register.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { VerificationModule } from '../verification/verification.module';
import { ProfileController } from './profile.controller';
@Module({
    imports: [
        PrismaModule, 
        forwardRef(() => AuthModule),
        VerificationModule
    ],
    controllers: [UserController, RegisterController, ProfileController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
