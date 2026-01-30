import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Username must have at least 3 characters',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password must have at least 8 characters',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;
}
