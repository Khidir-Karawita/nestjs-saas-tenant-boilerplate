import { registerAs } from '@nestjs/config';
import { Organization } from 'src/entities/organization.entity';
import { User } from 'src/entities/user.entity';

export default registerAs('tenant', () => ({
  entities: [User, Organization],
  domain: process.env.TENANT_DOMAIN,
}));
