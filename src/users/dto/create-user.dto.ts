import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsUnique } from 'src/common/validators/is-unique.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsUnique, ['User', 'username'])
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUnique, ['User', 'email'])
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Exclude()
  role?: any;
}
