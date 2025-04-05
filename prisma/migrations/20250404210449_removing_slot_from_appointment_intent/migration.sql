/*
  Warnings:

  - You are about to drop the column `slot` on the `AppointmentIntent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppointmentIntent" DROP COLUMN "slot",
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);
