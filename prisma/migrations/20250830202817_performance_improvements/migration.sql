/*
  Warnings:

  - The primary key for the `company_locations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `company_locations` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `company_locations` table. All the data in the column will be lost.
  - You are about to drop the column `combination_mode` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_id` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `exclusive` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `filters` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence` on the `price_adjustments` table. All the data in the column will be lost.
  - You are about to drop the `_CompanyToCompanyLocation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[company_id,day]` on the table `company_availabilities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,company_id]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `company_locations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_id` to the `company_locations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_CompanyToCompanyLocation" DROP CONSTRAINT "_CompanyToCompanyLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CompanyToCompanyLocation" DROP CONSTRAINT "_CompanyToCompanyLocation_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."company_locations" DROP CONSTRAINT "company_locations_locationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."price_adjustments" DROP CONSTRAINT "price_adjustments_created_by_id_fkey";

-- AlterTable
ALTER TABLE "public"."company_locations" DROP CONSTRAINT "company_locations_pkey",
DROP COLUMN "companyId",
DROP COLUMN "locationId",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "location_id" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_locations_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "company_locations_id_seq";

-- AlterTable
ALTER TABLE "public"."price_adjustments" DROP COLUMN "combination_mode",
DROP COLUMN "created_by_id",
DROP COLUMN "exclusive",
DROP COLUMN "filters",
DROP COLUMN "priority",
DROP COLUMN "recurrence";

-- DropTable
DROP TABLE "public"."_CompanyToCompanyLocation";

-- DropEnum
DROP TYPE "public"."CombinationMode";

-- CreateIndex
CREATE INDEX "Appointment_company_id_start_date_idx" ON "public"."Appointment"("company_id", "start_date");

-- CreateIndex
CREATE INDEX "Appointment_client_id_status_idx" ON "public"."Appointment"("client_id", "status");

-- CreateIndex
CREATE INDEX "Appointment_service_id_start_date_idx" ON "public"."Appointment"("service_id", "start_date");

-- CreateIndex
CREATE INDEX "Appointment_start_date_end_date_idx" ON "public"."Appointment"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "Appointment_staff_id_start_date_idx" ON "public"."Appointment"("staff_id", "start_date");

-- CreateIndex
CREATE INDEX "Appointment_deleted_at_idx" ON "public"."Appointment"("deleted_at");

-- CreateIndex
CREATE INDEX "animals_user_id_deleted_at_idx" ON "public"."animals"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "animals_breed_id_idx" ON "public"."animals"("breed_id");

-- CreateIndex
CREATE INDEX "assets_user_id_deleted_at_idx" ON "public"."assets"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "companies_deleted_at_idx" ON "public"."companies"("deleted_at");

-- CreateIndex
CREATE INDEX "company_availabilities_company_id_day_idx" ON "public"."company_availabilities"("company_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "company_availabilities_company_id_day_key" ON "public"."company_availabilities"("company_id", "day");

-- CreateIndex
CREATE INDEX "company_availability_exceptions_company_id_start_date_end_d_idx" ON "public"."company_availability_exceptions"("company_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "company_locations_company_id_idx" ON "public"."company_locations"("company_id");

-- CreateIndex
CREATE INDEX "company_locations_location_id_idx" ON "public"."company_locations"("location_id");

-- CreateIndex
CREATE INDEX "locations_city_state_idx" ON "public"."locations"("city", "state");

-- CreateIndex
CREATE INDEX "locations_latitude_longitude_idx" ON "public"."locations"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "public"."notifications"("user_id", "read", "created_at");

-- CreateIndex
CREATE INDEX "notifications_type_created_at_idx" ON "public"."notifications"("type", "created_at");

-- CreateIndex
CREATE INDEX "promotions_deleted_at_idx" ON "public"."promotions"("deleted_at");

-- CreateIndex
CREATE INDEX "promotions_is_active_start_date_end_date_idx" ON "public"."promotions"("is_active", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "ratings_company_id_created_at_idx" ON "public"."ratings"("company_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_user_id_company_id_key" ON "public"."ratings"("user_id", "company_id");

-- CreateIndex
CREATE INDEX "services_company_id_is_active_idx" ON "public"."services"("company_id", "is_active");

-- CreateIndex
CREATE INDEX "services_is_active_idx" ON "public"."services"("is_active");

-- CreateIndex
CREATE INDEX "user_companies_companyId_role_idx" ON "public"."user_companies"("companyId", "role");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "public"."users"("deleted_at");

-- AddForeignKey
ALTER TABLE "public"."company_locations" ADD CONSTRAINT "company_locations_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_locations" ADD CONSTRAINT "company_locations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
