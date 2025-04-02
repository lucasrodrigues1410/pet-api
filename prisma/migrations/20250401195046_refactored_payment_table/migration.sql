/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_payerId_fkey";

-- DropIndex
DROP INDEX "payments_appointmentId_idx";

-- DropIndex
DROP INDEX "payments_appointmentId_key";

-- DropIndex
DROP INDEX "payments_payerId_idx";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "appointmentId",
ALTER COLUMN "payerId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AppointmentTransaction" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AppointmentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentTransaction_appointmentId_idx" ON "AppointmentTransaction"("appointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentTransaction" ADD CONSTRAINT "AppointmentTransaction_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentTransaction" ADD CONSTRAINT "AppointmentTransaction_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
