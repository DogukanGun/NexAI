import { PrismaClient } from 'generated/prisma/client';
import { UserModel, createUserModel } from './user.model';
import { CompanyModel, createCompanyModel } from './company.model';
import { FileModel, createFileModel } from './file.model';

export interface Models {
  user: UserModel;
  company: CompanyModel;
  file: FileModel;
}

export function createModels(): Models {
  const prisma = new PrismaClient();
  
  return {
    user: createUserModel(prisma),
    company: createCompanyModel(prisma),
    file: createFileModel(prisma),
  };
}

// Export models
export { UserModel } from './user.model';
export { CompanyModel } from './company.model';
export { FileModel } from './file.model';

// Export constants
export * from './database.constant';

// Export providers
export * from './database-model.providers';

// Export module and service
export * from './database.module';
export * from './database.service'; 