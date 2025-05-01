import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom, of } from 'rxjs';
import { USER_MODEL } from '../database/database.constant';
import { UserModel } from '../database/user.model';
import { UserService } from './user.service';
import { UserType, SubscriptionType } from '../../generated/prisma/client';
import { RoleType } from '../config/enum';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel: UserModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_MODEL,
          useValue: {
            findByUsername: jest.fn(),
            existsByUsername: jest.fn(),
            existsByEmail: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
            getUserWithFiles: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<UserModel>(USER_MODEL);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register should create a new user', async () => {
    const sampleData = {
      username: 'hantsy',
      email: 'hantsy@example.com',
      firstName: 'hantsy',
      lastName: 'bai',
      password: 'mysecret',
      userType: UserType.INDIVIDUAL,
    };

    const mockUser = {
      id: '123',
      username: 'hantsy',
      email: 'hantsy@example.com',
      firstName: 'hantsy',
      lastName: 'bai',
      password: 'hashed-password',
      userType: UserType.INDIVIDUAL,
      roles: [RoleType.USER],
      subscriptionType: SubscriptionType.FREE,
      companyId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '123',
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(userModel, 'createUser').mockResolvedValue(mockUser);

    const result = await lastValueFrom(service.register(sampleData));
    
    expect(userModel.createUser).toHaveBeenCalledWith({
      username: sampleData.username,
      email: sampleData.email,
      firstName: sampleData.firstName,
      lastName: sampleData.lastName,
      password: sampleData.password,
      userType: sampleData.userType,
      roles: [RoleType.USER],
      subscriptionType: 'FREE',
      companyId: null,
    });
    
    expect(result.id).toBeDefined();
    expect(result.username).toBe('hantsy');
  });

  it('findByUsername should return user', async () => {
    const mockUser = {
      id: '123',
      username: 'hantsy',
      email: 'hantsy@example.com',
      firstName: 'hantsy',
      lastName: 'bai',
      password: 'hashed-password',
      userType: UserType.INDIVIDUAL,
      roles: [RoleType.USER],
      subscriptionType: SubscriptionType.FREE,
      companyId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '123',
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    jest.spyOn(userModel, 'findByUsername').mockResolvedValue(mockUser);

    const foundUser = await lastValueFrom(service.findByUsername('hantsy'));
    
    expect(foundUser).toEqual(mockUser);
    expect(userModel.findByUsername).toHaveBeenCalledWith('hantsy');
    expect(userModel.findByUsername).toHaveBeenCalledTimes(1);
  });

  it('findByUsername should throw when user not found', async () => {
    jest.spyOn(userModel, 'findByUsername').mockResolvedValue(null);

    try {
      await lastValueFrom(service.findByUsername('nonexistent'));
      fail('Expected to throw NotFoundException');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toContain('nonexistent');
    }
  });

  describe('findById', () => {
    const mockUser = {
      id: '123',
      username: 'hantsy',
      email: 'hantsy@example.com',
      firstName: 'hantsy',
      lastName: 'bai',
      password: 'hashed-password',
      userType: UserType.INDIVIDUAL,
      roles: [RoleType.USER],
      subscriptionType: SubscriptionType.FREE,
      companyId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '123',
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    it('should return one result', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(mockUser);

      const foundUser = await lastValueFrom(service.findById('123'));
      
      expect(foundUser).toEqual(mockUser);
      expect(userModel.findById).toHaveBeenCalledWith('123');
      expect(userModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw when user not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(null);

      try {
        await lastValueFrom(service.findById('nonexistent'));
        fail('Expected to throw NotFoundException');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toContain('nonexistent');
      }
    });

    it('should include files when withFiles=true', async () => {
      const mockUserWithFiles = {
        ...mockUser,
        uploadedFiles: [],
        company: null,
      };

      jest.spyOn(userModel, 'getUserWithFiles').mockResolvedValue(mockUserWithFiles);

      const foundUser = await lastValueFrom(service.findById('123', true));
      
      expect(foundUser).toEqual(mockUserWithFiles);
      expect(userModel.getUserWithFiles).toHaveBeenCalledWith('123');
      expect(userModel.getUserWithFiles).toHaveBeenCalledTimes(1);
    });
  });

  describe('existsByUsername', () => {
    it('should return true if username exists', async () => {
      jest.spyOn(userModel, 'existsByUsername').mockResolvedValue(true);
      
      const result = await lastValueFrom(service.existsByUsername('hantsy'));

      expect(userModel.existsByUsername).toHaveBeenCalledWith('hantsy');
      expect(userModel.existsByUsername).toHaveBeenCalledTimes(1);
      expect(result).toBeTruthy();
    });

    it('should return false if username does not exist', async () => {
      jest.spyOn(userModel, 'existsByUsername').mockResolvedValue(false);
      
      const result = await lastValueFrom(service.existsByUsername('nonexistent'));

      expect(userModel.existsByUsername).toHaveBeenCalledWith('nonexistent');
      expect(userModel.existsByUsername).toHaveBeenCalledTimes(1);
      expect(result).toBeFalsy();
    });
  });

  describe('existsByEmail', () => {
    it('should return true if email exists', async () => {
      jest.spyOn(userModel, 'existsByEmail').mockResolvedValue(true);
      
      const result = await lastValueFrom(service.existsByEmail('hantsy@example.com'));

      expect(userModel.existsByEmail).toHaveBeenCalledWith('hantsy@example.com');
      expect(userModel.existsByEmail).toHaveBeenCalledTimes(1);
      expect(result).toBeTruthy();
    });

    it('should return false if email does not exist', async () => {
      jest.spyOn(userModel, 'existsByEmail').mockResolvedValue(false);
      
      const result = await lastValueFrom(service.existsByEmail('nonexistent@example.com'));

      expect(userModel.existsByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(userModel.existsByEmail).toHaveBeenCalledTimes(1);
      expect(result).toBeFalsy();
    });
  });
});
