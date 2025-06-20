import { MariaDbDriver } from "@mikro-orm/mariadb";
import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
    entities: ['./dist/entities/**/*.js'],
    entitiesTs: ['./src/entities/**/*.ts'],
    driver: MariaDbDriver,

}));