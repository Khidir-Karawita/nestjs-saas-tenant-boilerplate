import type { EntityManager } from '@mikro-orm/mariadb';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import { Tenant } from '../../entities/tenant.entity';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../common/constants';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roleUser = await em.findOne(Role, { name: 'user' })!;
    const roleAdmin = await em.findOne(Role, { name: 'admin' })!;

    if (!roleUser) throw new Error("Role 'user' not found");
    if (!roleAdmin) throw new Error("Role 'admin' not found");
    new UserFactory(em)
      .each((user) => {
        user.role = roleUser;
        user.tenant = em.create(
          Tenant,
          new Tenant(user.username + Math.random().toString() + '.test.app'),
        )!;
      })
      .create(20);
    em.create(User, {
      username: 'admin',
      email: 'admin@admin.com',
      password: await bcrypt.hash('password', SALT_ROUNDS),
      role: roleAdmin,
      tenant: em.create(Tenant, new Tenant('admin'))!,
    });
  }
}
