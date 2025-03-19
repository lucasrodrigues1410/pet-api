-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "CompanyImagePurpose" AS ENUM ('LOGO', 'COVER');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "logoAssetId" TEXT;

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "AssetType" NOT NULL DEFAULT 'IMAGE',
    "format" TEXT,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "thumbnailUrl" TEXT,
    "formats" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_images" (
    "companyId" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "purpose" "CompanyImagePurpose" NOT NULL DEFAULT 'COVER',
    "sortOrder" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),

    CONSTRAINT "company_images_pkey" PRIMARY KEY ("companyId","assetId","purpose")
);

-- CreateIndex
CREATE INDEX "assets_type_idx" ON "assets"("type");

-- CreateIndex
CREATE INDEX "assets_url_idx" ON "assets"("url");

-- CreateIndex
CREATE INDEX "company_images_companyId_purpose_sortOrder_idx" ON "company_images"("companyId", "purpose", "sortOrder");

-- AddForeignKey
ALTER TABLE "company_images" ADD CONSTRAINT "company_images_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_images" ADD CONSTRAINT "company_images_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
