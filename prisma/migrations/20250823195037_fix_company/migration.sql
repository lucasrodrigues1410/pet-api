/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `company_images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."company_images_companyId_sortOrder_idx";

-- AlterTable
ALTER TABLE "public"."company_images" DROP COLUMN "sortOrder";
