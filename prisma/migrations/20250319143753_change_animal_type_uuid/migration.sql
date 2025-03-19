/*
  Warnings:

  - The primary key for the `animal_types` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_animal_type_id_fkey";

-- AlterTable
ALTER TABLE "animal_types" DROP CONSTRAINT "animal_types_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "animal_types_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "animal_types_id_seq";

-- AlterTable
ALTER TABLE "breeds" ALTER COLUMN "animal_type_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
