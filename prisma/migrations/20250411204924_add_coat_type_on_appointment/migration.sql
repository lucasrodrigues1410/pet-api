/*
  Warnings:

  - Added the required column `coatType` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CoatType" AS ENUM ('SHORT', 'MEDIUM', 'LONG');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "coatType" "CoatType" NOT NULL;
