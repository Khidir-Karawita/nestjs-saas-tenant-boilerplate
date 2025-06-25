import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique.validator';

export class CreateOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Validate(IsUnique, ['Organization', 'name'])
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
