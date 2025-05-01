import { PrismaClient, File, SubscriptionType } from 'generated/prisma/client';

export class FileModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createFile(fileData: { externalId: string; name: string; userId: string }): Promise<File> {
    // Check if user has premium access
    const user = await this.prisma.user.findUnique({
      where: { id: fileData.userId },
      include: {
        company: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has premium subscription directly or through company
    const hasPremium = user.subscriptionType === SubscriptionType.PREMIUM || 
                      (user.company && user.company.subscriptionType === SubscriptionType.PREMIUM);

    if (!hasPremium) {
      throw new Error('Premium subscription required for file uploads');
    }

    return this.prisma.file.create({
      data: fileData,
    });
  }

  async getFileById(fileId: string) {
    return this.prisma.file.findUnique({
      where: { id: fileId },
    });
  }

  async getUserFiles(userId: string) {
    return this.prisma.file.findMany({
      where: { userId },
    });
  }

  async deleteFile(fileId: string) {
    return this.prisma.file.delete({
      where: { id: fileId },
    });
  }

  async updateFileName(fileId: string, newName: string) {
    return this.prisma.file.update({
      where: { id: fileId },
      data: { name: newName },
    });
  }

  async getCompanyFiles(companyId: string) {
    const employees = await this.prisma.user.findMany({
      where: { companyId },
    });

    const employeeIds = employees.map(employee => employee.id);

    return this.prisma.file.findMany({
      where: {
        userId: { in: employeeIds },
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}

export const createFileModel = (prisma: PrismaClient): FileModel => {
  return new FileModel(prisma);
}; 