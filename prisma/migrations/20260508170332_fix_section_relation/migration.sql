/*
  Warnings:

  - You are about to drop the column `activityId` on the `DailyActivity` table. All the data in the column will be lost.
  - You are about to drop the column `bridgeElementId` on the `DailyActivity` table. All the data in the column will be lost.
  - Added the required column `elementId` to the `DailyActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyActivity" DROP COLUMN "activityId",
DROP COLUMN "bridgeElementId",
ADD COLUMN     "elementId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin',
ALTER COLUMN "name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Element"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
