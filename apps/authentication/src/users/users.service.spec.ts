import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { HashingService } from './hashing.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { GetUsersQueryDto } from '@app/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<UsersRepository>;
  let hashing: { hashPassword: jest.Mock };
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const repoMock: jest.Mocked<UsersRepository> = {
      createUser: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
    } as any;

    const hashingMock = {
      hashPassword: jest.fn().mockResolvedValue('hashed-password'),
      comparePassword: jest.fn(),
    };

    const jwtMock: Partial<jest.Mocked<JwtService>> = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: repoMock },
        { provide: HashingService, useValue: hashingMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsersRepository);
    hashing = module.get(HashingService);
    jwtService = module.get(JwtService);
  });

  it('should register a new user', async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.createUser.mockResolvedValue({
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'http://example.com/img.png',
      isActive: true,
      created: new Date(),
      updated: new Date(),
    } as any);

    const result = await service.registerUser({
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'http://example.com/img.png',
      password: 'password123',
      isActive: true,
    });

    expect(hashing.hashPassword).toHaveBeenCalledWith('password123');
    expect(repo.createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      profileImage: 'http://example.com/img.png',
      password: 'hashed-password',
      isActive: true,
    });
    expect(result.email).toBe('test@example.com');
  });
  
  describe('getAllUsers', () => {
    it('should return paginated users with correct meta', async () => {
      const page = 2;
      const limit = 2;
      const total = 5;

      const userDocs: any[] = [
        {
          _id: new Types.ObjectId('6564c1f1e1d2f00000000001'),
          name: 'User 1',
          email: 'user1@example.com',
          profileImage: 'http://example.com/1.png',
          isActive: true,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-02T00:00:00Z'),
        },
        {
          _id: new Types.ObjectId('6564c1f1e1d2f00000000002'),
          name: 'User 2',
          email: 'user2@example.com',
          profileImage: 'http://example.com/2.png',
          isActive: false,
          createdAt: new Date('2025-01-03T00:00:00Z'),
          updatedAt: new Date('2025-01-04T00:00:00Z'),
        },
      ];

      repo.findAll = jest.fn().mockResolvedValue({ items: userDocs, total });

      const query: GetUsersQueryDto = { page, limit };

      // Act
      const result = await service.getAllUsers(query);

      // Assert
      expect(repo.findAll).toHaveBeenCalledWith(page, limit);

      expect(result).toEqual({
        items: [
          {
            id: userDocs[0]._id.toString(),
            name: 'User 1',
            email: 'user1@example.com',
            profileImage: 'http://example.com/1.png',
            isActive: true,
            createdAt: userDocs[0].createdAt,
            updatedAt: userDocs[0].updatedAt,
          },
          {
            id: userDocs[1]._id.toString(),
            name: 'User 2',
            email: 'user2@example.com',
            profileImage: 'http://example.com/2.png',
            isActive: false,
            createdAt: userDocs[1].createdAt,
            updatedAt: userDocs[1].updatedAt,
          },
        ],
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit), // 3 in this case
        },
      });
    });

  });
});
