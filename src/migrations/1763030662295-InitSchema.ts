import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1763030662295 implements MigrationInterface {
  name = 'InitSchema1763030662295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reserve" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP NOT NULL, "finishDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "placeId" uuid, "userId" uuid, CONSTRAINT "PK_619d1e12dbedbe126620cac8240" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "place" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "description" character varying NOT NULL, "facilities" character varying NOT NULL, "price" integer NOT NULL, "isReserved" boolean NOT NULL DEFAULT false, "province" character varying NOT NULL, "city" character varying NOT NULL, "image" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_35472b1fe48b6330cd34970956" UNIQUE ("userId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying, "phone" character varying, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "isReserved" boolean NOT NULL DEFAULT false, "isOwner" boolean NOT NULL DEFAULT false, "isBan" boolean NOT NULL DEFAULT false, "refreshToken" character varying, "provider" character varying NOT NULL DEFAULT 'local', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "reserve" ADD CONSTRAINT "FK_cf7243781d3c84e841200ead8d3" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reserve" ADD CONSTRAINT "FK_dc318c87bc1d6552424a88a6444" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "FK_8158c413778562971d02cf8336f" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "FK_8158c413778562971d02cf8336f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reserve" DROP CONSTRAINT "FK_dc318c87bc1d6552424a88a6444"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reserve" DROP CONSTRAINT "FK_cf7243781d3c84e841200ead8d3"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "place"`);
    await queryRunner.query(`DROP TABLE "reserve"`);
  }
}
