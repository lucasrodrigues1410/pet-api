/*
  Warnings:

  - You are about to drop the column `avatar_asset_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_avatar_asset_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar_asset_id",
DROP COLUMN "type",
ADD COLUMN     "auth_provider_id" TEXT,
ADD COLUMN     "avatar_url" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."UserType";
