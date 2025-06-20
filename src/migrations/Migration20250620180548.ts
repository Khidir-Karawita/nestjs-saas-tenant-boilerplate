import { Migration } from '@mikro-orm/migrations';

export class Migration20250620180548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user\` (\`id\` bigint unsigned not null auto_increment primary key, \`username\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_username_unique\`(\`username\`);`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`user\`;`);
  }

}
