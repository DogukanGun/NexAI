import { PrismaClient } from 'generated/prisma/client';
import {
  COMPANY_MODEL,
  FILE_MODEL,
  USER_MODEL,
} from './database.constant';
import { createUserModel } from './user.model';
import { createCompanyModel } from './company.model';
import { createFileModel } from './file.model';

// Single PrismaClient instance to be shared across models
const prisma = new PrismaClient();

export const databaseModelsProviders = [
  {
    provide: USER_MODEL,
    useFactory: () => createUserModel(prisma),
  },
  {
    provide: COMPANY_MODEL,
    useFactory: () => createCompanyModel(prisma),
  },
  {
    provide: FILE_MODEL,
    useFactory: () => createFileModel(prisma),
  },
];