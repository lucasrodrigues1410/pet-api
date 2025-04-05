/*
  Warnings:

  - The values [NO_SHOW] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtScheduling` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `checkout_url` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `payer_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `price` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');
ALTER TABLE "Appointment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "AppointmentStatus_old";
ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'SCHEDULED';
COMMIT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_payer_id_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "notes",
DROP COLUMN "priceAtScheduling",
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "checkout_url",
DROP COLUMN "payer_id";

-- CreateTable
CREATE TABLE "AppointmentIntent" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "slot" TIME NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "clientId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentIntent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppointmentIntent" ADD CONSTRAINT "AppointmentIntent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentIntent" ADD CONSTRAINT "AppointmentIntent_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentIntent" ADD CONSTRAINT "AppointmentIntent_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
