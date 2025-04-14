/*
  Warnings:

  - Made the column `lunch_end_time` on table `company_availabilities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lunch_start_time` on table `company_availabilities` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "company_availabilities" ALTER COLUMN "lunch_end_time" SET NOT NULL,
ALTER COLUMN "lunch_end_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "lunch_start_time" SET NOT NULL,
ALTER COLUMN "lunch_start_time" SET DEFAULT CURRENT_TIMESTAMP;
