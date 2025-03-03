-- CreateTable
CREATE TABLE "animal_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "animal_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breeds" (
    "id" SERIAL NOT NULL,
    "animal_type_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "breed_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "birthdate" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "animal_types_name_key" ON "animal_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "breeds_name_key" ON "breeds"("name");

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_animal_type_id_fkey" FOREIGN KEY ("animal_type_id") REFERENCES "animal_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_breed_id_fkey" FOREIGN KEY ("breed_id") REFERENCES "breeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
