import { Migration } from '@mikro-orm/migrations';

export class Migration20250624195848_AddTenanToUserTable extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table \`user\` add \`tenant_id\` bigint unsigned not null;`,
    );
    this.addSql(
      `alter table \`user\` add constraint \`user_tenant_id_foreign\` foreign key (\`tenant_id\`) references \`tenant\` (\`id\`) on update cascade;`,
    );
    this.addSql(
      `alter table \`user\` add index \`user_tenant_id_index\`(\`tenant_id\`);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`user\` drop foreign key \`user_tenant_id_foreign\`;`,
    );

    this.addSql(`alter table \`user\` drop index \`user_tenant_id_index\`;`);
    this.addSql(`alter table \`user\` drop column \`tenant_id\`;`);
  }
}
