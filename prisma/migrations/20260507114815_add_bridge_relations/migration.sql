/*
  Warnings:

  - Added the required column `sections` to the `Bridge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bridge" ADD COLUMN     "location" TEXT,
ADD COLUMN     "sections" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Element" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT,
    "bridgeId" INTEGER NOT NULL,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "bridgeId" INTEGER NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
