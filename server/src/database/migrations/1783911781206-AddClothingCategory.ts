import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClothingCategory1783911781206 implements MigrationInterface {
    name = 'AddClothingCategory1783911781206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "merch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "price" numeric(12,2) NOT NULL, "description" text NOT NULL, "location" character varying(100) NOT NULL, "size" character varying(50), "color" character varying(100), "sold" boolean NOT NULL DEFAULT false, "images" text NOT NULL, "youtubeUrl" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30afd99d86b2dbf8022467c1bfe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "merch"`);
    }

}
