import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('seed')
  async seedUsers() {
    return this.userService.seedUsers();
  }

 
  @Get()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const pageNumber = isNaN(page) ? 1 : Math.max(1, page); 
    const limitNumber = isNaN(limit) ? 10 : Math.min(limit, 100); 
    return this.userService.getUsers(pageNumber, limitNumber);
  }
  


  @Get('count')
  async getTotalUsers() {
    return { totalUsers: await this.userService.getTotalUsers() };
  }


  @Get('age')
  async getUsersByAge(
    @Query('age') age: number,
    @Query('ageFrom') ageFrom: number,
    @Query('ageTo') ageTo: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.getUsersByAge(age, ageFrom, ageTo, page, limit);
  }
}
