/*
  Warnings:

  - The primary key for the `user_companies` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_companies" DROP CONSTRAINT "user_companies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_companies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_companies_id_seq";
