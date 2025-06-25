import { Migration } from '@mikro-orm/migrations';

export class Migration20250624195947_CreateOrganizationTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`organization\` (\`id\` bigint unsigned not null auto_increment primary key, \`created_at\` date not null, \`updated_at\` date not null, \`tenant_id\` bigint unsigned not null, \`name\` varchar(255) not null, \`description\` varchar(255) null) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`organization\` add index \`organization_tenant_id_index\`(\`tenant_id\`);`,
    );

    this.addSql(
      `alter table \`organization\` add constraint \`organization_tenant_id_foreign\` foreign key (\`tenant_id\`) references \`tenant\` (\`id\`) on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`organization\`;`);
  }
}
