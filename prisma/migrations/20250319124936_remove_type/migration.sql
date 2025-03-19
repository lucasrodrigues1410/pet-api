/*
  Warnings:

  - You are about to drop the column `type` on the `assets` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "assets_type_idx";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "type";

-- DropEnum
DROP TYPE "AssetType";
