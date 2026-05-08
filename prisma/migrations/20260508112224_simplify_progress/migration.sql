/*
  Warnings:

  - You are about to drop the column `sections` on the `Bridge` table. All the data in the column will be lost.
  - You are about to drop the `Progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pk_code]` on the table `Bridge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionId` to the `Bridge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bridge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_bridgeId_fkey";

-- AlterTable
ALTER TABLE "Bridge" DROP COLUMN "sections",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pk_code" TEXT,
ADD COLUMN     "sectionId" INTEGER NOT NULL,
ADD COLUMN     "totalCompleted" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalPlanned" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Progress";

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bridge_pk_code_key" ON "Bridge"("pk_code");

-- AddForeignKey
ALTER TABLE "Bridge" ADD CONSTRAINT "Bridge_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
