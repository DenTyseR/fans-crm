import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers(@Query() paginationDto: PaginationDto) {
    return this.userService.getAllUsers(paginationDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
