import { MariaDbDriver } from "@mikro-orm/mariadb";
import { Migrator } from "@mikro-orm/migrations";
import { Options } from "@mikro-orm/core";
import  dotenv from 'dotenv';
import { SeedManager } from "@mikro-orm/seeder";

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
  seeder: {
    path: process.env.MIKRO_ORM_SEEDER_PATH || './dist/seeders', 
    pathTs: process.env.MIKRO_ORM_SEEDER_PATH_TS || './src/seeders', 
    defaultSeeder: process.env.MIKRO_ORM_SEEDER_DEFAULT_SEEDER || 'DatabaseSeeder', 
    glob: process.env.MIKRO_ORM_SEEDER_GLOB || '!(*.d).{js,ts}', 
    emit: (process.env.MIKRO_ORM_SEEDER_EMIT as 'ts' | 'js' | undefined) || 'ts', 
    fileName: (className: string) => className.toLowerCase() + '.seeder', 
  },
  driver: MariaDbDriver,
  extensions: [Migrator,SeedManager],
  debug: process.env.NODE_ENV !== 'production',
  
};

export default config;

