-- CreateEnum
CREATE TYPE "ServicePriceVariationType" AS ENUM ('SIZE');

-- CreateEnum
CREATE TYPE "ServicePriceVariationValue" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "service_price_variations" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "variation" "ServicePriceVariationType" NOT NULL,
    "value" "ServicePriceVariationValue" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_price_variations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_price_variations" ADD CONSTRAINT "service_price_variations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
