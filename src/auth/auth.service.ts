import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/signIn.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);

    const payload = { sub: user._id, username: user.username };

    return {
      user: user,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOne(signInDto.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passCheck = await bcrypt.compare(signInDto.password, user.password);

    if (!passCheck) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };

    return {
      acces_token: await this.jwtService.signAsync(payload),
    };
  }
}
