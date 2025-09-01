/*
  Warnings:

  - A unique constraint covering the columns `[animal_type_id,name]` on the table `breeds` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."breeds_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "breeds_animal_type_id_name_key" ON "public"."breeds"("animal_type_id", "name");
