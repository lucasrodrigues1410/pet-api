/*
  Warnings:

  - The primary key for the `locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `company_locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."company_locations" DROP CONSTRAINT "company_locations_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_locations" DROP CONSTRAINT "company_locations_location_id_fkey";

-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "location_id" TEXT;

-- AlterTable
ALTER TABLE "public"."locations" DROP CONSTRAINT "locations_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "locations_id_seq";

-- DropTable
DROP TABLE "public"."company_locations";

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
