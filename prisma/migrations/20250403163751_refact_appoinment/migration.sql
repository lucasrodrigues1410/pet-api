/*
  Warnings:

  - You are about to drop the `AppointmentTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `paymentId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AppointmentTransaction" DROP CONSTRAINT "AppointmentTransaction_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentTransaction" DROP CONSTRAINT "AppointmentTransaction_paymentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "paymentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AppointmentTransaction";

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
