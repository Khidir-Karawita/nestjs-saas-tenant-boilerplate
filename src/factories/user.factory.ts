import { Factory } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
export class UserFactory extends Factory<User> {
  model = User;

  definition(): Partial<User> {
    return {
      username: faker.person.lastName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync('password', 10),
    };
  }
}