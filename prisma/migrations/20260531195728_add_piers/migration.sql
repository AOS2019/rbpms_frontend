/*
  Warnings:

  - Made the column `pk_code` on table `Bridge` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BridgeType" AS ENUM ('BRIDGE', 'OVERBRIDGE');

-- AlterTable
ALTER TABLE "Bridge" ADD COLUMN     "bridgeType" "BridgeType" NOT NULL DEFAULT 'BRIDGE',
ALTER COLUMN "pk_code" SET NOT NULL;

-- CreateTable
CREATE TABLE "Pier" (
    "id" SERIAL NOT NULL,
    "pierNumber" TEXT NOT NULL,
    "bridgeId" INTEGER NOT NULL,
    "height" DOUBLE PRECISION,
    "columnCount" INTEGER NOT NULL DEFAULT 2,
    "shape" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" SERIAL NOT NULL,
    "columnNumber" TEXT NOT NULL,
    "pierId" INTEGER NOT NULL,
    "shape" TEXT,
    "height" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pier" ADD CONSTRAINT "Pier_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_pierId_fkey" FOREIGN KEY ("pierId") REFERENCES "Pier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
