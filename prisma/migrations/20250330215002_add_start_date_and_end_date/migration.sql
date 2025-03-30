/*
  Warnings:

  - You are about to drop the column `dateTime` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_companyId_dateTime_idx";

-- DropIndex
DROP INDEX "Appointment_dateTime_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "dateTime",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
