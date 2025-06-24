import { Migration } from '@mikro-orm/migrations';

export class Migration20250624191426_CreateTenantTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`tenant\` (\`id\` bigint unsigned not null auto_increment primary key, \`created_at\` date not null, \`updated_at\` date not null, \`domain\` varchar(255) not null, \`is_active\` tinyint(1) null default true) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`tenant\` add unique \`tenant_domain_unique\`(\`domain\`);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`tenant\`;`);
  }
}
