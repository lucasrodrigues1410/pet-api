/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `assets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "assets_name_key" ON "public"."assets"("name");
