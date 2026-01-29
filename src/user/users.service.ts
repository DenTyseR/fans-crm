import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers(options: { page: number; limit: number }) {
    const { page, limit } = options;

    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Invalid pagination params');
    }

    const skip = (page - 1) * limit;

    const users = await this.userModel.find({}).skip(skip).limit(limit).exec();

    const totalUsers = await this.userModel.countDocuments({}).exec();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalUsers,
      currentPage: page,
      totalPages,
      limit,
    };
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async findOne(username: string) {
    return await this.userModel.findOne({ username });
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async deleteUser(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('User not found');
    }
  }
}
