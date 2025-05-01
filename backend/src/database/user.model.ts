import { hash, compare } from 'bcrypt';
import { PrismaClient, User, SubscriptionType, UserType } from '../../generated/prisma/client';
import { Observable, from } from 'rxjs';

// Add compatibility extension to Users type
export interface PrismaUserWithMethods extends User {
  _id: string;
  comparePassword(password: string): Observable<boolean>;
}

export class UserModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const hashedPassword = await hash(userData.password, 12);
    
    return this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles: userData.roles,
        userType: userData.userType,
        subscriptionType: userData.subscriptionType,
        companyId: userData.companyId
      },
    });
  }

  async findByUsername(username: string): Promise<PrismaUserWithMethods | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;
    
    // Add compatibility properties and methods
    return this.addMethodsToUser(user);
  }

  // Helper to add Mongoose-style methods to Prisma User objects
  private addMethodsToUser(user: User): PrismaUserWithMethods {
    const userWithMethods = user as PrismaUserWithMethods;
    userWithMethods._id = user.id; // Add _id for compatibility
    
    // Add comparePassword method
    userWithMethods.comparePassword = (password: string): Observable<boolean> => {
      return from(compare(password, user.password));
    };
    
    return userWithMethods;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { username },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async findById(id: string): Promise<PrismaUserWithMethods | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) return null;
    
    // Add compatibility properties and methods
    return this.addMethodsToUser(user);
  }

  async comparePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.password);
  }

  async getUserWithFiles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        uploadedFiles: true,
        company: true,
      },
    });
    
    if (!user) return null;
    
    // Add compatibility properties and methods
    return this.addMethodsToUser(user);
  }

  async upgradeToPremium(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionType: SubscriptionType.PREMIUM },
    });
  }

  async addFile(userId: string, externalId: string, fileName: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.subscriptionType !== SubscriptionType.PREMIUM) {
      throw new Error('Premium subscription required for file uploads');
    }

    return this.prisma.file.create({
      data: {
        externalId,
        name: fileName,
        userId,
      },
    });
  }

  // Virtual field getter for full name
  getFullName(user: User): string {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
}

// Factory function to create the model
export const createUserModel = (prisma: PrismaClient): UserModel => {
  return new UserModel(prisma);
};
