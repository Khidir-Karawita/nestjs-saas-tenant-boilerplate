import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory';
import { Role } from '../entities/role.entity';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
export class UserSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    const roleUser = await em.findOne(Role, { name: 'user' })!;
    const roleAdmin = await em.findOne(Role, { name: 'admin' })!;

    if (!roleUser) throw new Error("Role 'user' not found");
    if (!roleAdmin) throw new Error("Role 'admin' not found");
    new UserFactory(em).each(user => {
      user.role = roleUser;
    }).create(100);
    // em.create(User, {
    //   username: 'admin',
    //   email: 'admin@admin.com',
    //   password: await bcrypt.hash('paswword', 10),
    //   role: roleAdmin,
    // });
  }

}
