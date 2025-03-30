/*
  Warnings:

  - You are about to drop the `appointments` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ONE_TIME', 'RECURRING');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_company_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_user_id_fkey";

-- DropTable
DROP TABLE "appointments";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "priceAtScheduling" DECIMAL(10,2),
    "clientId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "type" "PaymentType" NOT NULL,
    "gateway" TEXT NOT NULL,
    "gatewayTransactionId" TEXT,
    "gatewayPaymentIntentId" TEXT,
    "paymentMethodDetails" JSONB,
    "errorMessage" TEXT,
    "payerId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointment_dateTime_idx" ON "Appointment"("dateTime");

-- CreateIndex
CREATE INDEX "Appointment_clientId_idx" ON "Appointment"("clientId");

-- CreateIndex
CREATE INDEX "Appointment_animalId_idx" ON "Appointment"("animalId");

-- CreateIndex
CREATE INDEX "Appointment_companyId_dateTime_idx" ON "Appointment"("companyId", "dateTime");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gatewayTransactionId_key" ON "Payment"("gatewayTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gatewayPaymentIntentId_key" ON "Payment"("gatewayPaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointmentId_key" ON "Payment"("appointmentId");

-- CreateIndex
CREATE INDEX "Payment_payerId_idx" ON "Payment"("payerId");

-- CreateIndex
CREATE INDEX "Payment_status_type_idx" ON "Payment"("status", "type");

-- CreateIndex
CREATE INDEX "Payment_appointmentId_idx" ON "Payment"("appointmentId");

-- CreateIndex
CREATE INDEX "Payment_gatewayTransactionId_idx" ON "Payment"("gatewayTransactionId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
