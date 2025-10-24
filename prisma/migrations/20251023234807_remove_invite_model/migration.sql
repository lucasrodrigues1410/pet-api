/*
  Warnings:

  - You are about to drop the `invites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."invites" DROP CONSTRAINT "invites_user_id_fkey";

-- DropTable
DROP TABLE "public"."invites";
