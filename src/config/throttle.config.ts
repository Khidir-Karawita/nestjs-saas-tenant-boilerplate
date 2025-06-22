import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => [
  {
    name: 'short',
    ttl: 1000,
    limit: 2,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 100,
  },
]);
