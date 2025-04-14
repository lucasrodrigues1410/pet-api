-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_staffId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "user_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
