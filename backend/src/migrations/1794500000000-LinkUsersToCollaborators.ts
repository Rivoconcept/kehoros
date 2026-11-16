import { MigrationInterface, QueryRunner } from 'typeorm';

export class LinkUsersToCollaborators1794500000000 implements MigrationInterface {
  name = 'LinkUsersToCollaborators1794500000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "collaborator_id" uuid',
    );
    await queryRunner.query(`
      UPDATE "users" AS u
      SET "collaborator_id" = c."id"
      FROM "collaborators" AS c
      WHERE u."collaborator_id" IS NULL
        AND LOWER(TRIM(u."email")) = LOWER(TRIM(c."email"))
        AND UPPER(TRIM(u."matricule")) = UPPER(TRIM(c."matricule"))
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_users_collaborator_id"
      ON "users" ("collaborator_id")
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'FK_users_collaborator_id'
        ) THEN
          ALTER TABLE "users"
          ADD CONSTRAINT "FK_users_collaborator_id"
          FOREIGN KEY ("collaborator_id")
          REFERENCES "collaborators"("id")
          ON DELETE RESTRICT;
        END IF;
      END
      $$
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "FK_users_collaborator_id"',
    );
    await queryRunner.query(
      'DROP INDEX IF EXISTS "UQ_users_collaborator_id"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN IF EXISTS "collaborator_id"',
    );
  }
}
