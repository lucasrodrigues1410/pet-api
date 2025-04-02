/*
  Warnings:

  - You are about to drop the column `gatewayPaymentIntentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payerId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gateway_payment_intent_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payer_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_payerId_fkey";

-- DropIndex
DROP INDEX "payments_gatewayPaymentIntentId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gatewayPaymentIntentId",
DROP COLUMN "payerId",
ADD COLUMN     "gateway_payment_intent_id" TEXT,
ADD COLUMN     "payer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_gateway_payment_intent_id_key" ON "payments"("gateway_payment_intent_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payer_id_fkey" FOREIGN KEY ("payer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
