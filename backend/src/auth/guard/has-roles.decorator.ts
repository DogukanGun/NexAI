import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/config/enum';
import { HAS_ROLES_KEY } from '../auth.constants';

export const HasRoles = (...args: RoleType[]) => SetMetadata(HAS_ROLES_KEY, args);
