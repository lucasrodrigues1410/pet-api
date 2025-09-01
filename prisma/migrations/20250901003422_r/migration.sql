/*
  Warnings:

  - Made the column `location_id` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."companies" DROP CONSTRAINT "companies_location_id_fkey";

-- AlterTable
ALTER TABLE "public"."companies" ALTER COLUMN "location_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
