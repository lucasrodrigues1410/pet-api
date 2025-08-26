/*
  Warnings:

  - You are about to drop the column `createdAt` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `logoAssetId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `companies` table. All the data in the column will be lost.
  - The primary key for the `company_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `purpose` on the `company_images` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `company_images` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `company_images` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `company_images` table. All the data in the column will be lost.
  - The required column `id` was added to the `company_images` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "public"."company_images_companyId_purpose_sortOrder_idx";

-- AlterTable
ALTER TABLE "public"."companies" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "logoAssetId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "logo_asset_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."company_images" DROP CONSTRAINT "company_images_pkey",
DROP COLUMN "purpose",
DROP COLUMN "validFrom",
DROP COLUMN "validTo",
DROP COLUMN "version",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "company_images_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "public"."CompanyImagePurpose";

-- CreateIndex
CREATE INDEX "company_images_companyId_sortOrder_idx" ON "public"."company_images"("companyId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_logo_asset_id_fkey" FOREIGN KEY ("logo_asset_id") REFERENCES "public"."assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
