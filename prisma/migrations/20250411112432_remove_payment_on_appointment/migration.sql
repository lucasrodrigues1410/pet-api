/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `AppointmentIntent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentIntent" DROP CONSTRAINT "AppointmentIntent_animalId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentIntent" DROP CONSTRAINT "AppointmentIntent_clientId_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentIntent" DROP CONSTRAINT "AppointmentIntent_serviceId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "paymentId";

-- DropTable
DROP TABLE "AppointmentIntent";
