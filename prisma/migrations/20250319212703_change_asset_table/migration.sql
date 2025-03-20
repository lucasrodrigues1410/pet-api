/*
  Warnings:

  - You are about to drop the column `format` on the `assets` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "asset_id" TEXT;

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "format",
DROP COLUMN "metadata",
ADD COLUMN     "file_type" TEXT;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
