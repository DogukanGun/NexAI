import { Inject, Injectable } from '@nestjs/common';
import { USER_MODEL, COMPANY_MODEL, FILE_MODEL } from './database.constant';
import { UserModel } from './user.model';
import { CompanyModel } from './company.model';
import { FileModel } from './file.model';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(USER_MODEL) private readonly userModel: UserModel,
    @Inject(COMPANY_MODEL) private readonly companyModel: CompanyModel,
    @Inject(FILE_MODEL) private readonly fileModel: FileModel,
  ) {}

  getUserModel(): UserModel {
    return this.userModel;
  }

  getCompanyModel(): CompanyModel {
    return this.companyModel;
  }

  getFileModel(): FileModel {
    return this.fileModel;
  }
} 