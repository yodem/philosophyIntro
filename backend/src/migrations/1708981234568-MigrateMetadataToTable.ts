import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class MigrateMetadataToTable1708981234568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get all content with metadata
    const contentWithMetadata = await queryRunner.query(
      `SELECT id, metadata FROM "content" WHERE metadata IS NOT NULL AND metadata != '{}'::jsonb`,
    );

    // Insert metadata entries for each content
    for (const content of contentWithMetadata) {
      const metadata = content.metadata;

      for (const [key, value] of Object.entries(metadata)) {
        // Skip null/undefined values
        if (value === null || value === undefined) continue;

        // Convert value to string
        const stringValue =
          typeof value === 'object' ? JSON.stringify(value) : String(value);

        // Insert metadata entry
        await queryRunner.query(
          `INSERT INTO "content_metadata" (id, key, value, "contentId") VALUES ($1, $2, $3, $4)`,
          [uuidv4(), key, stringValue, content.id],
        );
      }
    }

    // The next step would be to remove the metadata column, but it's kept for now for backward compatibility
    // This can be done in a later migration after ensuring everything works correctly
    // await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "metadata"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This would be complex to revert precisely, but we can attempt to restore metadata back to the JSON column
    const metadataEntries = await queryRunner.query(
      `SELECT "contentId", key, value FROM "content_metadata"`,
    );

    // Group entries by content ID
    const entriesByContent = metadataEntries.reduce(
      (acc: Record<string, any[]>, entry: any) => {
        acc[entry.contentId] = acc[entry.contentId] || [];
        acc[entry.contentId].push(entry);
        return acc;
      },
      {},
    );

    // Update content with aggregated metadata
    for (const [contentId, metadata] of Object.entries(entriesByContent)) {
      await queryRunner.query(
        `UPDATE "content" SET metadata = $1::jsonb WHERE id = $2`,
        [JSON.stringify(metadata), contentId],
      );
    }

    // Delete all metadata entries
    await queryRunner.query(`DELETE FROM "content_metadata"`);
  }
}
