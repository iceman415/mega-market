import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCoreTables1783309464539 implements MigrationInterface {
    name = 'CreateCoreTables1783309464539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying(100) NOT NULL, "model" character varying(100) NOT NULL, "year" character varying(10) NOT NULL, "price" numeric(12,2) NOT NULL, "mileage" character varying(50) NOT NULL, "description" text NOT NULL, "location" character varying(100) NOT NULL, "sold" boolean NOT NULL DEFAULT false, "images" text NOT NULL, "youtubeUrl" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "partNumber" character varying(100) NOT NULL, "compatibility" character varying(200) NOT NULL, "price" numeric(12,2) NOT NULL, "description" text NOT NULL, "location" character varying(100) NOT NULL, "sold" boolean NOT NULL DEFAULT false, "images" text NOT NULL, "youtubeUrl" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "parts"`);
        await queryRunner.query(`DROP TABLE "vehicles"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
