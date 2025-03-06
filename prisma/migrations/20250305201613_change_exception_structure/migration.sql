/*
  Warnings:

  - You are about to drop the column `day` on the `company_availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `company_availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `exception_date` on the `company_availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `is_recurring` on the `company_availability_exceptions` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `company_availability_exceptions` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `company_availability_exceptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `company_availability_exceptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "company_availability_exceptions" DROP COLUMN "day",
DROP COLUMN "end_time",
DROP COLUMN "exception_date",
DROP COLUMN "is_recurring",
DROP COLUMN "start_time",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL;
