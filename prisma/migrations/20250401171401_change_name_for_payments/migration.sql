/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payerId_fkey";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "payments" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_gatewayTransactionId_key" ON "payments"("gatewayTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gatewayPaymentIntentId_key" ON "payments"("gatewayPaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointmentId_key" ON "payments"("appointmentId");

-- CreateIndex
CREATE INDEX "payments_payerId_idx" ON "payments"("payerId");

-- CreateIndex
CREATE INDEX "payments_status_type_idx" ON "payments"("status", "type");

-- CreateIndex
CREATE INDEX "payments_appointmentId_idx" ON "payments"("appointmentId");

-- CreateIndex
CREATE INDEX "payments_gatewayTransactionId_idx" ON "payments"("gatewayTransactionId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
