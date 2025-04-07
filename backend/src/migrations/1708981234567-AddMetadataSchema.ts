import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetadataSchema1708981234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if enum type exists before creating it
    const enumExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'metadata_data_type_enum'
      );
    `);

    if (!enumExists[0].exists) {
      await queryRunner.query(`
        CREATE TYPE "metadata_data_type_enum" AS ENUM ('string', 'number', 'date', 'text');
      `);
    }

    // Check if table exists before creating it
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'metadata_schema'
      );
    `);

    if (!tableExists[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "metadata_schema" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "contentType" character varying NOT NULL,
          "key" character varying NOT NULL,
          "displayName" character varying NOT NULL,
          "dataType" "metadata_data_type_enum" NOT NULL DEFAULT 'string',
          "isRequired" boolean NOT NULL DEFAULT false,
          "description" character varying,
          "displayOrder" integer NOT NULL DEFAULT 0,
          CONSTRAINT "PK_metadata_schema" PRIMARY KEY ("id")
        );
      `);

      // Add indexes
      await queryRunner.query(`
        CREATE INDEX "IDX_metadata_schema_contentType" ON "metadata_schema" ("contentType");
      `);
      await queryRunner.query(`
        CREATE INDEX "IDX_metadata_schema_key" ON "metadata_schema" ("key");
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_metadata_schema_key"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_metadata_schema_contentType"`,
    );

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "metadata_schema"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE IF EXISTS "metadata_data_type_enum"`);
  }
}
