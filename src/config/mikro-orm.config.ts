import { MariaDbDriver } from "@mikro-orm/mariadb";
import { Migrator } from "@mikro-orm/migrations";
import { Options } from "@mikro-orm/core";
import  dotenv from 'dotenv';

const envFiles = ['.env.development.local', '.env'];
dotenv.config({ path: envFiles });

const config: Options = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  driver: MariaDbDriver,
  extensions: [Migrator],
  debug: process.env.NODE_ENV !== 'production',
};

export default config;

