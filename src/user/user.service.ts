import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seedUsers() {
    const users = [];
    for (let i = 0; i < 30000; i++) {
      users.push({
        id: i + 1,  
        name: faker.person.fullName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 80 }),
      });
    }
    await this.userModel.insertMany(users);
    return '30,000 users added';
  }
  

  async getUsers(page: number = 1, limit: number = 10) {
    const pageNumber = Math.max(page, 1);
    const maxLimit = Math.min(limit, 100); 
    return this.userModel
      .find()
      .select('id name email age') 
      .limit(maxLimit)
      .skip((pageNumber - 1) * maxLimit)
      .exec();
  }
  
  

  async getTotalUsers() {
    return this.userModel.countDocuments();
  }

  async getUsersByAge(age?: number, ageFrom?: number, ageTo?: number, page: number = 1, limit: number = 10) {
    const query: any = {};
    if (age) {
      query.age = age;
    } else if (ageFrom && ageTo) {
      query.age = { $gte: ageFrom, $lte: ageTo };
    }
    const maxLimit = Math.min(limit, 100); 
    return this.userModel
      .find(query)
      .limit(maxLimit)
      .skip((page - 1) * maxLimit)
      .exec();
  }
}
