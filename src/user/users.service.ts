import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

type Filter = {
  username?: object;
  name?: object;
  email?: object;
  phone?: object;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAllUsers(
    options: { page: number; limit: number },
    filterUserDto: FilterUserDto,
  ) {
    const { page, limit } = options;

    if (isNaN(page) || isNaN(limit)) {
      throw new BadRequestException('Invalid pagination params');
    }

    const skip = (page - 1) * limit;

    const filter: Filter = {};

    if (filterUserDto.username) {
      filter.username = { $regex: filterUserDto.username, $options: 'i' };
    }

    if (filterUserDto.name) {
      filter.name = { $regex: filterUserDto.name, $options: 'i' };
    }

    if (filterUserDto.email) {
      filter.email = { $regex: filterUserDto.email, $options: 'i' };
    }

    if (filterUserDto.phone) {
      filter.phone = { $regex: filterUserDto.phone, $options: 'i' };
    }

    const users = await this.userModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalUsers = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalUsers / limit);

    if (page > totalPages) {
      throw new BadRequestException(`Last page is ${totalPages}`);
    }

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
    const user = await this.userModel.findOne({
      username: createUserDto.username,
    });

    if (user) {
      throw new BadRequestException('User already exists!');
    }

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
