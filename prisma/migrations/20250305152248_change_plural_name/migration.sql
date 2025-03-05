/*
  Warnings:

  - You are about to drop the `company_availability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "company_availability" DROP CONSTRAINT "company_availability_company_id_fkey";

-- DropTable
DROP TABLE "company_availability";

-- CreateTable
CREATE TABLE "company_availabilities" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "start_time" TIME(1) NOT NULL,
    "end_time" TIME(1) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_availabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_availabilities" ADD CONSTRAINT "company_availabilities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
