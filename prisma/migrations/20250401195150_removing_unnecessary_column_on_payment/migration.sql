/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayTransactionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethodDetails` on the `payments` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payments_gatewayTransactionId_idx";

-- DropIndex
DROP INDEX "payments_gatewayTransactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "errorMessage",
DROP COLUMN "gatewayTransactionId",
DROP COLUMN "paymentMethodDetails";
