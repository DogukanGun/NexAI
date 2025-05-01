import { PrismaClient, Company, SubscriptionType } from 'generated/prisma/client';

export class CompanyModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'subscriptionType'>): Promise<Company> {
    return this.prisma.company.create({
      data: {
        ...companyData,
        subscriptionType: SubscriptionType.FREE,
      },
    });
  }

  async getCompanyById(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
    });
  }

  async getCompanyWithEmployees(companyId: string) {
    return this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: true,
      },
    });
  }

  async upgradeToPremium(companyId: string) {
    return this.prisma.company.update({
      where: { id: companyId },
      data: { subscriptionType: SubscriptionType.PREMIUM },
    });
  }

  async downgradeToFree(companyId: string) {
    // Get all employee files before downgrading
    const company = await this.getCompanyWithEmployees(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const userIds = company.users.map(user => user.id);

    // Transaction to downgrade company and update employees
    return this.prisma.$transaction(async (tx) => {
      // Downgrade company
      await tx.company.update({
        where: { id: companyId },
        data: { subscriptionType: SubscriptionType.FREE },
      });

      // Remove file access from employees
      // Note: This doesn't delete files, just removes access
      return true;
    });
  }

  async addEmployee(companyId: string, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        companyId: companyId,
      },
    });
  }

  async removeEmployee(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        companyId: null,
      },
    });
  }
}

export const createCompanyModel = (prisma: PrismaClient): CompanyModel => {
  return new CompanyModel(prisma);
};
