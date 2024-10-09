import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.dto';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


describe('seedUsers', () => {
    it('should seed 30,000 users', async () => {
     
      jest.spyOn(model, 'insertMany').mockResolvedValueOnce([]);
  
      const result = await service.seedUsers();
      
    
      expect(result).toBe('30,000 users added');
      expect(model.insertMany).toHaveBeenCalledTimes(1);
      expect(model.insertMany).toHaveBeenCalledWith(expect.any(Array)); 
    });
  });
  


  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const users = [{ id: 1, name: 'John Doe', email: 'john@example.com', age: 30 }];
      jest.spyOn(model, 'find').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const result = await service.getUsers(1, 10);
      
      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalled();
      expect(model.find().select).toHaveBeenCalledWith('id name email age');
      expect(model.find().limit).toHaveBeenCalledWith(10);
      expect(model.find().skip).toHaveBeenCalledWith(0); 
    });
  });


  describe('getTotalUsers', () => {
    it('should return total number of users', async () => {
      jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(30000);

      const result = await service.getTotalUsers();

      expect(result).toBe(30000);
      expect(model.countDocuments).toHaveBeenCalled();
    });
  });


  describe('getUsersByAge', () => {
    it('should return users within age range', async () => {
      const users = [{ id: 1, name: 'Jane Doe', age: 25 }];
      const mockQuery = { age: { $gte: 18, $lte: 30 } };

      jest.spyOn(model, 'find').mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const result = await service.getUsersByAge(undefined, 18, 30, 1, 10);

      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalledWith(mockQuery);
      expect(model.find().limit).toHaveBeenCalledWith(10);
      expect(model.find().skip).toHaveBeenCalledWith(0); 
    });

    it('should return users with a specific age', async () => {
      const users = [{ id: 1, name: 'John Doe', age: 30 }];
      const mockQuery = { age: 30 };

      jest.spyOn(model, 'find').mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(users),
      } as any);

      const result = await service.getUsersByAge(30, undefined, undefined, 1, 10);

      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalledWith(mockQuery);
      expect(model.find().limit).toHaveBeenCalledWith(10);
      expect(model.find().skip).toHaveBeenCalledWith(0); 
    });
  });
});
