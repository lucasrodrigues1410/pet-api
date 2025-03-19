/*
  Warnings:

  - The primary key for the `_CompanyToCompanyLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `animals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `appointments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `breeds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `company_availabilities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `company_availability_exceptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `company_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `service_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToCompanyLocation" DROP CONSTRAINT "_CompanyToCompanyLocation_A_fkey";

-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_breed_id_fkey";

-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_user_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_company_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "company_availabilities" DROP CONSTRAINT "company_availabilities_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company_availability_exceptions" DROP CONSTRAINT "company_availability_exceptions_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company_images" DROP CONSTRAINT "company_images_companyId_fkey";

-- DropForeignKey
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_service_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_company_id_fkey";

-- DropForeignKey
ALTER TABLE "user_companies" DROP CONSTRAINT "user_companies_companyId_fkey";

-- DropForeignKey
ALTER TABLE "user_companies" DROP CONSTRAINT "user_companies_userId_fkey";

-- AlterTable
ALTER TABLE "_CompanyToCompanyLocation" DROP CONSTRAINT "_CompanyToCompanyLocation_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ADD CONSTRAINT "_CompanyToCompanyLocation_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "animals" DROP CONSTRAINT "animals_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "breed_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "animals_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "animals_id_seq";

-- AlterTable
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "company_id" SET DATA TYPE TEXT,
ALTER COLUMN "service_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "appointments_id_seq";

-- AlterTable
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "breeds_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "breeds_id_seq";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "companies_id_seq";

-- AlterTable
ALTER TABLE "company_availabilities" DROP CONSTRAINT "company_availabilities_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "company_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_availabilities_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "company_availabilities_id_seq";

-- AlterTable
ALTER TABLE "company_availability_exceptions" DROP CONSTRAINT "company_availability_exceptions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "company_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_availability_exceptions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "company_availability_exceptions_id_seq";

-- AlterTable
ALTER TABLE "company_images" DROP CONSTRAINT "company_images_pkey",
ALTER COLUMN "companyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "company_images_pkey" PRIMARY KEY ("companyId", "assetId", "purpose");

-- AlterTable
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_pkey",
ALTER COLUMN "service_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "service_categories_pkey" PRIMARY KEY ("service_id", "category_id");

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "company_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "services_id_seq";

-- AlterTable
ALTER TABLE "user_companies" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "companyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "breeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_availabilities" ADD CONSTRAINT "company_availabilities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_availability_exceptions" ADD CONSTRAINT "company_availability_exceptions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_images" ADD CONSTRAINT "company_images_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToCompanyLocation" ADD CONSTRAINT "_CompanyToCompanyLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
