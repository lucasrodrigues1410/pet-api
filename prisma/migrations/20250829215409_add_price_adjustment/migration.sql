-- CreateEnum
CREATE TYPE "public"."PriceAdjustmentType" AS ENUM ('discount', 'surcharge');

-- CreateEnum
CREATE TYPE "public"."PriceAdjustmentMethod" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "public"."CombinationMode" AS ENUM ('stack', 'override', 'best');

-- CreateTable
CREATE TABLE "public"."price_adjustments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "service_id" TEXT,
    "type" "public"."PriceAdjustmentType" NOT NULL,
    "method" "public"."PriceAdjustmentMethod" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_from" TIMESTAMP(3),
    "valid_to" TIMESTAMP(3),
    "recurrence" JSONB,
    "filters" JSONB,
    "combination_mode" "public"."CombinationMode" NOT NULL,
    "exclusive" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "price_adjustments_service_id_idx" ON "public"."price_adjustments"("service_id");

-- CreateIndex
CREATE INDEX "price_adjustments_is_active_valid_from_valid_to_idx" ON "public"."price_adjustments"("is_active", "valid_from", "valid_to");

-- AddForeignKey
ALTER TABLE "public"."price_adjustments" ADD CONSTRAINT "price_adjustments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_adjustments" ADD CONSTRAINT "price_adjustments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
