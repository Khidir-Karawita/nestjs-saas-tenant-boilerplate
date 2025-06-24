import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsUnique } from 'src/common/validators/is-unique.validator';
import { User } from 'src/entities/user.entity';
import { Tenant } from 'src/entities/tenant.entity';
import { IsDomainUnique } from '../validators/is-domain-unique.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsUnique, [User.name, 'username'])
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Validate(IsUnique, [User.name, 'email'])
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Validate(IsDomainUnique)
  domain: string;
}
