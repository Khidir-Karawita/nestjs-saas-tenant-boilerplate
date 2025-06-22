import { Migration } from '@mikro-orm/migrations';

export class Migration20250622193530_init extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`permission\` (\`id\` bigint unsigned not null auto_increment primary key, \`created_at\` date not null, \`updated_at\` date not null, \`name\` varchar(255) not null, \`action\` varchar(255) null, \`subject\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`permission\` add unique \`permission_name_unique\`(\`name\`);`);

    this.addSql(`create table \`role\` (\`id\` bigint unsigned not null auto_increment primary key, \`created_at\` date not null, \`updated_at\` date not null, \`name\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role\` add unique \`role_name_unique\`(\`name\`);`);

    this.addSql(`create table \`role_permissions\` (\`role_id\` bigint unsigned not null, \`permission_id\` bigint unsigned not null, primary key (\`role_id\`, \`permission_id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_permissions\` add index \`role_permissions_role_id_index\`(\`role_id\`);`);
    this.addSql(`alter table \`role_permissions\` add index \`role_permissions_permission_id_index\`(\`permission_id\`);`);

    this.addSql(`create table \`user\` (\`id\` bigint unsigned not null auto_increment primary key, \`created_at\` date not null, \`updated_at\` date not null, \`username\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, \`role_id\` bigint unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add unique \`user_username_unique\`(\`username\`);`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);
    this.addSql(`alter table \`user\` add index \`user_role_id_index\`(\`role_id\`);`);

    this.addSql(`alter table \`role_permissions\` add constraint \`role_permissions_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`role_permissions\` add constraint \`role_permissions_permission_id_foreign\` foreign key (\`permission_id\`) references \`permission\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`user\` add constraint \`user_role_id_foreign\` foreign key (\`role_id\`) references \`role\` (\`id\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`role_permissions\` drop foreign key \`role_permissions_permission_id_foreign\`;`);

    this.addSql(`alter table \`role_permissions\` drop foreign key \`role_permissions_role_id_foreign\`;`);

    this.addSql(`alter table \`user\` drop foreign key \`user_role_id_foreign\`;`);

    this.addSql(`drop table if exists \`permission\`;`);

    this.addSql(`drop table if exists \`role\`;`);

    this.addSql(`drop table if exists \`role_permissions\`;`);

    this.addSql(`drop table if exists \`user\`;`);
  }

}
