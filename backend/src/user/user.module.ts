import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RegisterController } from './register.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, forwardRef(() => AuthModule)],
    controllers: [UserController, RegisterController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
