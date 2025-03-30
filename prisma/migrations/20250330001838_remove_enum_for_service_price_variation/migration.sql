/*
  Warnings:

  - Changed the type of `variation` on the `service_price_variations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `value` on the `service_price_variations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "service_price_variations" DROP COLUMN "variation",
ADD COLUMN     "variation" TEXT NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ServicePriceVariationType";

-- DropEnum
DROP TYPE "ServicePriceVariationValue";
