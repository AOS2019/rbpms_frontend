/*
  Warnings:

  - Added the required column `bridgeId` to the `DailyActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `DailyActivity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PierType" AS ENUM ('PIER', 'ABUTMENT');

-- AlterTable
ALTER TABLE "DailyActivity" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "bridgeId" INTEGER NOT NULL,
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pier" ADD COLUMN     "type" "PierType" NOT NULL DEFAULT 'PIER';

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_bridgeId_fkey" FOREIGN KEY ("bridgeId") REFERENCES "Bridge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
