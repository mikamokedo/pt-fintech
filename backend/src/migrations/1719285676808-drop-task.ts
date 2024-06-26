import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTask1719285676801 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
