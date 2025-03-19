-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "address_line" VARCHAR(255) NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "complement" VARCHAR(255),
    "neighborhood" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_locations" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompanyToCompanyLocation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompanyToCompanyLocation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToCompanyLocation_B_index" ON "_CompanyToCompanyLocation"("B");

-- AddForeignKey
ALTER TABLE "company_locations" ADD CONSTRAINT "company_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToCompanyLocation" ADD CONSTRAINT "_CompanyToCompanyLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToCompanyLocation" ADD CONSTRAINT "_CompanyToCompanyLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "company_locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
